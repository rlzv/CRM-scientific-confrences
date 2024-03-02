const User =  require('/models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('pasport-jwt').Strategy;

// Function to extract token from request cookies
const extractTokenFromCookies = request => {
    let token = null;
    if (request && request.cookies) {
        token = request.cookies['access_token'];
    }
    return token;
}

// Authentication using JWT strategy
passport.use(new JWTStrategy({
    jwtFromRequest: extractTokenFromCookies,
    secretOrKey: 'secret'
}, async (payload, done) => {
    try {
        // Find user by ID from payload
        const user = await User.findById({ _id: payload.sub });
        
        // If user does not exist, return false
        if (!user) {
            return done(null, false);
        }
        
        // User exists, return user
        return done(null, user);
    } catch (error) {
        // If an error occurs, pass it to done callback
        return done(error);
    }
}));

// Authentication using username and password
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Find user by username
        const user = await User.findOne({ username });
        
        // If user does not exist, return false
        if (!user) {
            return done(null, false);
        }
        
        // Compare password
        user.comparePassword(password, (error, isMatch) => {
            if (error) {
                return done(error);
            }
            
            // If passwords match, return user
            if (isMatch) {
                return done(null, user);
            } else {
                // If passwords do not match, return false
                return done(null, false);
            }
        });
    } catch (error) {
        // If an error occurs, pass it to done callback
        return done(error);
    }
}));
