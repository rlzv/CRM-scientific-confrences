import axios from 'axios'

export default {
    
    // LOGIN
    login: async (user) => {
        try {
          const res = await axios.post('http://localhost:5000/user/login', user, {
            withCredentials: true,
          });
          return res.data;
        } catch (error) {
          console.error(error);
          return { isAuthenticated: false, user: { username: '', role: '' } };
        }
      },

    // REGISTER

    register: async (user) => {
      try {
        const response = await axios.post('http://localhost:5000/user/register', user, {
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        console.error("Registration error:", error);
  
        // Check if the error response has a data property with the expected structure
        if (error.response && error.response.data) {
          return error.response.data;
        } else {
          // Return a default structure with an error message if the response is not structured as expected
          return {
            isAuthenticated: false,
            user: { username: "", role: "" },
            message: { msgBody: "Registration failed due to an unexpected error.", msgError: true }
          };
        }
      }
    },

    // LOGOUT
    logout: async () => {
      try {
        const res = await fetch('http://localhost:5000/user/logout',{credentials: 'include'});
        const data = await res.json();
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // AUTHENTICATED
     isAuthenticated:  () => {
       return fetch('http://localhost:5000/user/authenticated',{credentials: 'include'})
            .then(res => {
                if (res.status !== 401)
                return res.json().then(data => {
                  //console.log("Data is ", data);
                  return data;
                });
                else
                    return { isAuthenticated: false, user: { username: "", role: "" } }
            })
     },

    // ORGANIZER
    isAdmin:  () => {
    return fetch('http://localhost:5000/user/admin',{credentials: 'include'})
          .then(res => {
            if (res.status !== 401)
                return res.json().then(data => {
                  //console.log("Data is ", data);
                  return data;
                });
                  
              else
                  return { isAdmin: false }
          })
  }
}






   