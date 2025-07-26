import InputFieldBorderless from '../../../components/util-components/InputFieldBorderless';
import Dropdown from '../../../components/dropdowns/Dropdown';
import { useUser } from '../../../store/user-context';
import './usersManager.scss';
import { NewUserTypes } from '../../../global/types';
import Checkbox from '../../../components/checkbox/Checkbox';
import Button from '../../../components/util-components/Button';
import {
  notifyError,
  notifySuccess,
} from '../../../components/util-components/Notify';
import { betterConsoleLog } from '../../../util-methods/log-methods';
import { useFetchData } from '../../../hooks/useFetchData';
import { useAdmin } from '../../../store/admin-context';

interface UsersManagerProps {
  newUser: NewUserTypes;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserTypes>>;
}

function UsersManager({ newUser, setNewUser }: UsersManagerProps) {
  const { getRoleDropdownOptions } = useUser();
  const { getDefaultUserObject } = useAdmin();
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
        <h2>All Users</h2>
        <div></div>
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

function UsersList() {
  return <div>UsersManager</div>;
}
