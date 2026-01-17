import axios from 'axios';
import { sessionService } from 'redux-react-session';

export const loginUser = (credentials, navigate, setFieldError, setSubmitting) => {
  return () => {
    console.log('[CLIENT] Logging in with:', credentials.email);
    axios.post('https://purposespace-backend-b9ecfc575955.herokuapp.com/user/signin', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const { data } = response;
        console.log('[CLIENT] Login Response:', data);
        const { status, message, data: userData } = data;

        if (status === "FAILED") {
          console.error('[CLIENT] Login Failed:', message);
          setFieldError(message);
          setSubmitting(false);
        } else if (status === "SUCCESS") {
          console.log('[CLIENT] Login Success. Token:', userData.token);
          const { token } = userData;
          sessionService.saveSession(token)
            .then(() => {
              sessionService.saveUser(userData)
                .then(() => {
                  // Save to localStorage for Homepage.jsx compatibility
                  localStorage.setItem('authToken', token);
                  localStorage.setItem('userData', JSON.stringify(userData));
                  navigate('/');
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }
      })
      .catch(err => {
        console.error(err);
        setSubmitting(false);
        setFieldError('An error occurred during login');
      });
  };
};

export const loginAdmin = (credentials, navigate, setFieldError, setSubmitting) => {
  return () => {
    console.log('[CLIENT] Logging in Admin with:', credentials.email);
    axios.post('https://purposespace-backend-b9ecfc575955.herokuapp.com/user/admin/signin', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const { data } = response;
        console.log('[CLIENT] Admin Login Response:', data);
        const { status, message, data: userData } = data;

        if (status === "FAILED") {
          console.error('[CLIENT] Admin Login Failed:', message);
          setFieldError(message);
          setSubmitting(false);
        } else if (status === "SUCCESS") {
          console.log('[CLIENT] Admin Login Success. Token:', userData.token);
          const { token } = userData;
          sessionService.saveSession(token)
            .then(() => {
              sessionService.saveUser(userData)
                .then(() => {
                  // Save to localStorage for Homepage.jsx compatibility
                  localStorage.setItem('authToken', token);
                  localStorage.setItem('userData', JSON.stringify(userData));
                  navigate('/'); // Redirect to homepage or admin dashboard
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }
      })
      .catch(err => {
        console.error(err);
        setSubmitting(false);
        setFieldError('An error occurred during admin login');
      });
  };
};

export const signupUser = (credentials, navigate, setFieldError, setSubmitting) => {
  return () => { 
    console.log('[CLIENT] Signing up with:', credentials.email);
    axios.post('https://purposespace-backend-b9ecfc575955.herokuapp.com/user/signup', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const { data } = response;
        console.log('[CLIENT] Signup Response:', data);
        const { status, message } = data;

        if (status === "FAILED") {
          setFieldError(message);
          setSubmitting(false);
        } else if (status === "PENDING") {
          const { email } = credentials;
          navigate(`/emailsent/${email}?role=admin`);
        }
      }) 
      .catch(err => {
        console.error(err); 
        setSubmitting(false);
        setFieldError('An error occurred during signup');
      });
  };
};

export const signupAdmin = (credentials, navigate, setFieldError, setSubmitting) => {
  return () => {
    console.log('[CLIENT] Signing up Admin with:', credentials.email);
    axios.post('https://purposespace-backend-b9ecfc575955.herokuapp.com/user/admin/signup', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const { data } = response;
        console.log('[CLIENT] Admin Signup Response:', data);
        const { status, message } = data;

        if (status === "FAILED") {
          setFieldError(message);
          setSubmitting(false);
        } else if (status === "PENDING") {
          const { email } = credentials;
          navigate(`/emailsent/${email}?role=admin`);
        }
      }) 
      .catch(err => {
        console.error(err); 
        setSubmitting(false);
        setFieldError('An error occurred during admin signup');
      });
  };
};

export const logoutUser = (navigate) => {
  return () => {
    sessionService.deleteSession();
    sessionService.deleteUser();
    // Clear localStorage for Homepage.jsx compatibility
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/signin');
  };
};