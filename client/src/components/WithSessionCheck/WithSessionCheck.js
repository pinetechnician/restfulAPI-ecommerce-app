import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkSession } from '../../redux/auth/authSlice'; 

const withSessionCheck = (WrappedComponent) => {
    return (props) => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const { loading, error, isLoggedIn } = useSelector((state) => state.auth);

        //useEffect(() => {
            // Dispatch session check on mount
            //dispatch(checkSession());
            //console.log('did we checkSession first?');
       // }, [dispatch]);

        useEffect(() => {
            if (!loading) {
                if (isLoggedIn == false) {
                    console.log('Not logged in, navigating to login');
                    navigate('/login');
                } else if (isLoggedIn == true) {
                    console.log('User is logged in');
                } else {
                    console.log('still loading...');
                }
              }
        }, [loading, isLoggedIn, navigate]);

        // Render null while checking session, to avoid flashing the component
        if (loading) return null;

        // If authenticated, render the wrapped component
        return isLoggedIn ? <WrappedComponent {...props} /> : null;
    };
};

export default withSessionCheck;