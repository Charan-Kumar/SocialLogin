import { useCallback, useState } from 'react';
import './App.css'
import {
  LoginSocialGoogle,
  LoginSocialFacebook,
  LoginSocialLinkedin,
} from 'reactjs-social-login';

import {
  FacebookLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
} from 'react-social-login-buttons';
import { User } from './User';
import axios from 'axios';
import GoogleOAuth from './GoogleOAuth';
import LinkedInOAuth from './LinkedInOAuth';

const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URL || 'http://localhost:5173/account/login'

function App() {
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState();

  const onLoginStart = useCallback(() => {
    alert('login start');
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider('');
    alert('logout success');
  }, []);

  const onLogout = useCallback(() => {
    onLogoutSuccess()
  }, [onLogoutSuccess]);


  return (
    <>
      { provider && profile ? (
        <User provider={provider} profile={profile} onLogout={onLogout} />
      ): 
      <div className={`App ${provider && profile ? 'hide' : ''}`}>
        <LoginSocialFacebook
          appId={import.meta.env.VITE_APP_FB_APP_ID || ''}
          fieldsProfile={
            'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender'
          }
          onLoginStart={onLoginStart}
          onLogoutSuccess={onLogoutSuccess}
          redirect_uri={REDIRECT_URI}
          onResolve={({ provider, data }) => {


            setProvider(provider);
            setProfile(data);
            console.log(data)

          }}
          onReject={err => {
            console.log(err);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>

        <LoginSocialGoogle
          client_id={import.meta.env.VITE_APP_GG_APP_ID || ''}
          onLoginStart={onLoginStart}
          redirect_uri={REDIRECT_URI}
          scope="openid profile email"
          discoveryDocs="claims_supported"
          access_type="offline"
          onResolve={({ provider, data }) => {
            debugger;
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.code}`, {
                        headers: {
                            Authorization: `Bearer ${data.code}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));

            setProvider(provider);
            setProfile(data);
            console.log(data)

          }}
          onReject={err => {
            console.log(err);
          }}
        >
          <GoogleLoginButton />
        </LoginSocialGoogle>

        <LoginSocialLinkedin
          isOnlyGetToken
          scope={"openid profile email"}
          client_id={import.meta.env.VITE_APP_LINKEDIN_APP_ID || ''}
          client_secret={import.meta.env.VITE_APP_LINKEDIN_APP_SECRET || ''}
          redirect_uri={REDIRECT_URI}
          onLoginStart={onLoginStart}
          onResolve={({ provider, data }) => {
            setProvider(provider);
            setProfile(data);
            console.log(data)
          }}
          onReject={(err) => {
            console.log(err);
          }}
        >
          <LinkedInLoginButton />
        </LoginSocialLinkedin>

        <GoogleOAuth />

      </div>
      }
    </>
  );
}

export default App
