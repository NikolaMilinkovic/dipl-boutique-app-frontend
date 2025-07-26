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
import { useEffect } from 'react';
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

  async function handleCreateUser() {
    try {
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
      <div className="dashboard-card new-user-section">
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

        <Button label="Create new user" onClick={handleCreateUser} />
      </div>
      {/* USERS LIST */}
      <div className="dashboard-card">
        <h2>All Users ({usersData.length})</h2>
        <InputFieldBorderless label="Search users" />
        <AnimatedList
          items={usersData as UserType[]}
          renderItem={(user: UserType) => <UserItem user={user as UserType} />}
          noDataImage="/img/no_data_found.png"
          noDataAlt="Infinity Boutique Logo"
          className="user-list-section"
          maxWidth="800px"
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
  const { openDrawer, updateDrawerContent, isDrawerOpen } = useDrawerModal();
  const { showConfirmation } = useConfirmationModal();
  const { fetchWithBodyData } = useFetchData();
  useEffect(() => {
    // Update drawer content when searchParams change and drawer is open
    if (isDrawerOpen) {
      updateDrawerContent(<p>TEST</p>, JSON.stringify(user));
    }
  }, [user, isDrawerOpen]);

  async function removeUserHandler() {
    showConfirmation(async () => {
      const response = await fetchWithBodyData(
        'user/remove',
        user._id,
        'DELETE',
      );

      if (!response) {
        notifyError('There was an error while deleting the user');
        return;
      }
      const result = await response.json();
      notifySuccess(result.message);
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
          openDrawer(<p>TEST</p>, JSON.stringify(user));
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
