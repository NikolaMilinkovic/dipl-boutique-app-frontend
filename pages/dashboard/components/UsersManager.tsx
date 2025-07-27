import InputFieldBorderless from '../../../components/util-components/InputFieldBorderless';
import Dropdown from '../../../components/dropdowns/Dropdown';
import { useUser } from '../../../store/user-context';
import './usersManager.scss';
import { NewUserTypes, User, UserType } from '../../../global/types';
import Checkbox from '../../../components/checkbox/Checkbox';
import Button from '../../../components/util-components/Button';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import { betterConsoleLog } from '../../../util-methods/log-methods';
import { useFetchData } from '../../../hooks/useFetchData';
import { useAdmin } from '../../../store/admin-context';
import AnimatedList from '../../../components/lists/AnimatedList';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDrawerModal } from '../../../store/modals/drawer-modal-contex';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useConfirmationModal } from '../../../store/modals/confirmation-modal-context';

interface UsersManagerProps {
  newUser: NewUserTypes;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserTypes>>;
}

function UsersManager({ newUser, setNewUser }: UsersManagerProps) {
  const { getRoleDropdownOptions } = useUser();
  const { getDefaultUserObject, usersData } = useAdmin();
  const { fetchWithBodyData } = useFetchData();
  const role_dropdown_options = getRoleDropdownOptions();
  const selectedRoleOption =
    role_dropdown_options.find((opt) => opt.value === newUser.role) ??
    role_dropdown_options[0];
  const [query, setQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!query) return usersData;
    return usersData.filter(
      (user: any) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase()),
    );
  }, [usersData, query]);

  async function handleCreateUser(e) {
    try {
      e.preventDefault();
      const response = await fetchWithBodyData('user/create', newUser, 'POST');
      if (!response) return;

      const parsed = await response.json();

      if (response.status === 200) {
        notifySuccess(parsed.message);
        const resetData = getDefaultUserObject();
        setNewUser(resetData);
      } else {
        notifyError(parsed.message);
      }
    } catch (error) {
      betterConsoleLog('Error while creating a new user', error);
      notifyError('Error while creating a new user');
    }
  }

  return (
    <section className="users-manager-section">
      <form className="dashboard-card new-user-section">
        <h2>New User</h2>

        {/* BASIC INFO */}
        <div className="basic-user-info-container">
          <InputFieldBorderless
            label="Username"
            inputText={newUser.username}
            setInputText={(val) =>
              setNewUser((prev) => ({
                ...prev,
                username: val,
              }))
            }
          />
          <InputFieldBorderless
            label="Password"
            inputText={newUser.password}
            showPasswordBtn={true}
            type="password"
            setInputText={(val) =>
              setNewUser((prev) => ({
                ...prev,
                password: val,
              }))
            }
          />
          <Dropdown
            value={selectedRoleOption}
            options={role_dropdown_options}
            defaultValue={{ label: 'User', value: 'user' }}
            onSelect={(selected) =>
              setNewUser((prev) => ({ ...prev, role: selected.value }))
            }
          />
        </div>

        {/* PERMISSIONS */}
        <div className="user-permissions-container">
          <UserPermissionRow
            label="Category"
            newUser={newUser}
            setNewUser={setNewUser}
            permission="category"
          />
          <UserPermissionRow
            label="Color"
            newUser={newUser}
            setNewUser={setNewUser}
            permission="color"
          />
          <UserPermissionRow
            label="Courier"
            newUser={newUser}
            setNewUser={setNewUser}
            permission="courier"
          />
          <UserPermissionRow
            label="Supplier"
            newUser={newUser}
            setNewUser={setNewUser}
            permission="supplier"
          />
          <UserPermissionRow
            label="Order"
            newUser={newUser}
            setNewUser={setNewUser}
            permission="order"
          />
          <UserPermissionRow
            label="Product"
            newUser={newUser}
            setNewUser={setNewUser}
            permission="product"
          />
        </div>

        <Button
          label="Create new user"
          onClick={(e) => handleCreateUser(e)}
          type="submit"
        />
      </form>
      {/* USERS LIST */}
      <div className="dashboard-card users-list-container">
        <h2>All Users ({usersData.length})</h2>
        <InputFieldBorderless
          label="Search users"
          inputText={query}
          setInputText={setQuery}
        />
        <AnimatedList
          containScroll={false}
          items={filteredData as UserType[]}
          renderItem={(user: UserType) => <UserItem user={user as UserType} />}
          noDataImage="/img/no_data_found.png"
          noDataAlt="Infinity Boutique Logo"
          className="user-list-section"
        />
      </div>
    </section>
  );
}

export default UsersManager;

interface UserPermissionRowTypes {
  newUser: NewUserTypes;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserTypes>>;
  permission: string;
  label: string;
}
function UserPermissionRow({
  newUser,
  setNewUser,
  permission,
  label,
}: UserPermissionRowTypes) {
  function handlePermissionChange(
    permission: keyof NewUserTypes['permissions'],
    action: 'add' | 'edit' | 'remove',
    setNewUser: React.Dispatch<React.SetStateAction<NewUserTypes>>,
  ) {
    setNewUser((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: {
          ...prev.permissions[permission],
          [action]: !prev.permissions[permission][action],
        },
      },
    }));
  }
  function handleGiveAllPermissions() {
    handlePermissionChange(permission as any, 'add', setNewUser);
    handlePermissionChange(permission as any, 'edit', setNewUser);
    handlePermissionChange(permission as any, 'remove', setNewUser);
  }

  return (
    <div className="user-permissions-row">
      <span className="user-permissions-label">{label}</span>
      <Checkbox
        label="All"
        checked={
          newUser.permissions[permission].add &&
          newUser.permissions[permission].edit &&
          newUser.permissions[permission].remove
        }
        onCheckedChange={handleGiveAllPermissions}
      />
      <Checkbox
        label="Add"
        checked={newUser.permissions[permission].add}
        onCheckedChange={() =>
          handlePermissionChange(permission as any, 'add', setNewUser)
        }
      />
      <Checkbox
        label="Edit"
        checked={newUser.permissions[permission].edit}
        onCheckedChange={() =>
          handlePermissionChange(permission as any, 'edit', setNewUser)
        }
      />
      <Checkbox
        label="Remove"
        checked={newUser.permissions[permission].remove}
        onCheckedChange={() =>
          handlePermissionChange(permission as any, 'remove', setNewUser)
        }
      />
    </div>
  );
}

interface UserItemPropTypes {
  user: UserType;
}
function UserItem({ user }: UserItemPropTypes) {
  if (!user) return;
  const { openDrawer } = useDrawerModal();
  const { showConfirmation } = useConfirmationModal();
  const { fetchData } = useFetchData();

  async function removeUserHandler() {
    showConfirmation(async () => {
      const response = await fetchData(`user/remove/${user._id}`, 'DELETE');

      if (!response) {
        notifyError('There was an error while deleting the user');
        return;
      }
      notifySuccess(response.message);
    }, `Are you sure you want to delete user ${user.username}?`);
  }

  return (
    <div className="grid-1-1 user-item">
      <span>
        Username: <b>{user.username}</b>
      </span>
      <span>
        Role: <b>{user.role}</b>
      </span>
      <button
        className={`user-edit-btn`}
        onClick={() => {
          openDrawer(<EditUserComponent user={user} />, JSON.stringify(user));
        }}
      >
        <MdEdit style={{ color: 'var(--primaryDark)', fontSize: '26px' }} />
      </button>
      <button className={`user-delete-btn`} onClick={removeUserHandler}>
        <MdDelete style={{ color: 'var(--primaryDark)', fontSize: '26px' }} />
      </button>
    </div>
  );
}

interface EditUserComponentTypes {
  user: UserType;
}
function EditUserComponent({ user }: EditUserComponentTypes) {
  const { closeDrawer, isDrawerOpen } = useDrawerModal();
  const submitRef = useRef<HTMLButtonElement>(null);
  const [updatedUser, setUpdatedUser] = useState(user);
  const { fetchWithBodyData } = useFetchData();
  // useEffect(() => {
  //   betterConsoleLog('>updatedUser', updatedUser);
  // }, [updatedUser]);
  const { getRoleDropdownOptions } = useUser();
  const role_dropdown_options = getRoleDropdownOptions();
  if (!updatedUser) return;
  const selectedRoleOption =
    role_dropdown_options.find(
      (opt) => opt.value.toLowerCase() === updatedUser.role?.toLowerCase(),
    ) ?? role_dropdown_options[0];

  async function handleUpdateUser(e) {
    try {
      e.preventDefault();
      const response = await fetchWithBodyData(
        'user/update',
        updatedUser,
        'PATCH',
      );
      if (!response) return;

      const parsed = await response.json();

      if (response.status === 200) {
        notifySuccess(parsed.message);
        closeDrawer();
      } else {
        notifyError(parsed.message);
      }
    } catch (error) {
      betterConsoleLog('Error while creating a new user', error);
      notifyError('Error while creating a new user');
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (user === updatedUser) return;
      if (e.key === 'Enter' && isDrawerOpen) {
        e.preventDefault();
        submitRef.current?.click();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, user, updatedUser]);

  return (
    <form className="edit-user-modal-container scroll-styles">
      <h2>Edit User</h2>
      <div className="edit-user-info-container">
        <InputFieldBorderless
          label="Username"
          inputText={updatedUser.username}
          setInputText={(val) =>
            setUpdatedUser((prev) => ({
              ...prev,
              username: val,
            }))
          }
        />
        <InputFieldBorderless
          label="Password"
          inputText={updatedUser.password}
          showPasswordBtn={true}
          type="password"
          setInputText={(val) =>
            setUpdatedUser((prev) => ({
              ...prev,
              password: val,
            }))
          }
        />
        <Dropdown
          value={selectedRoleOption}
          options={role_dropdown_options}
          defaultValue={selectedRoleOption}
          onSelect={(selected) =>
            setUpdatedUser((prev) => ({ ...prev, role: selected.value }))
          }
        />
      </div>

      {/* PERMISSIONS */}
      <div className="edit-user-permissions-container">
        <UserPermissionRow
          label="Category"
          newUser={updatedUser}
          setNewUser={setUpdatedUser as any}
          permission="category"
        />
        <UserPermissionRow
          label="Color"
          newUser={updatedUser}
          setNewUser={setUpdatedUser as any}
          permission="color"
        />
        <UserPermissionRow
          label="Courier"
          newUser={updatedUser}
          setNewUser={setUpdatedUser as any}
          permission="courier"
        />
        <UserPermissionRow
          label="Supplier"
          newUser={updatedUser}
          setNewUser={setUpdatedUser as any}
          permission="supplier"
        />
        <UserPermissionRow
          label="Order"
          newUser={updatedUser}
          setNewUser={setUpdatedUser as any}
          permission="order"
        />
        <UserPermissionRow
          label="Product"
          newUser={updatedUser}
          setNewUser={setUpdatedUser as any}
          permission="product"
        />
      </div>

      <Button
        label="Update user"
        onClick={(e) => handleUpdateUser(e)}
        className="update-user-button"
        type="submit"
        ref={submitRef}
      />
    </form>
  );
}
