import { useState } from 'react';
import './login.scss';
import InputField from '../../components/util-components/InputField';
import Button from '../../components/util-components/Button';
import { notifyError } from '../../components/util-components/Notify';
import { useAuth } from '../../store/auth-context';

function Login() {
  const date = new Date();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  function verifyInput(e) {
    if (!formData.username) {
      notifyError('Please input your username');
      return false;
    }
    if (!formData.password) {
      notifyError('Please input your password');
      return false;
    }
    return true;
  }
  async function loginUser(e) {
    e.preventDefault();
    const isInputVerified = verifyInput(e);
    if (!isInputVerified) return;
    await login(formData.username, formData.password);
  }

  return (
    <main className="login-page-main">
      <form method="POST" action="" className="login-form">
        <img
          src="/img/infinity.png"
          alt="Infinity Boutique Logo"
          className="login-logo"
        ></img>
        <div className="login-inputs-wrapper">
          <InputField
            inputText={formData.username}
            label="username"
            id="username-input"
            showClearBtn={true}
            setInputText={(text) =>
              setFormData((prev) => ({ ...prev, username: text as string }))
            }
          />
          <InputField
            inputText={formData.password}
            label="password"
            id="password-input"
            type="password"
            showPasswordBtn={true}
            setInputText={(text) =>
              setFormData((prev) => ({ ...prev, password: text as string }))
            }
          />
        </div>

        <Button label="Login" onClick={(e) => loginUser(e)} type="submit" />

        {/* COPYRIGHT */}
        <a
          href="https://github.com/NikolaMilinkovic"
          className="copyright-link"
          target="_blank"
        >
          ©{date.getFullYear()} nikolamlinkovic221@gmail.com
        </a>
      </form>
    </main>
  );
}

export default Login;
