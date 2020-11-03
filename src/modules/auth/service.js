const throwError = require('../../util/error');
const config = require('../../config/config');

/**
 * authService - Handles all things auth related
 *  */
module.exports = ({ User, jwt, bcrypt }) => {
  /**
   * Sign up a new user to the system. Check if email already exists for this new user.
   * If a new email hash inputted password and save user data to database.
   * @param {string} firstName - First name of user
   * @param {string} lastName - Last name of user
   * @param {string} email - email
   * @param {string} password - password
   * @returns Some user record fields on success
   *  */
  async function signup({ firstName, lastName, email, password }) {
    const emailAlreadyExists = await User.findOne({
      where: { email },
    });

    if (emailAlreadyExists) {
      throwError('Failed to create new user, email already in use', 409, 'Email is already in use');
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newuser = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    return {
      id: newuser.id,
      firstName,
      lastName,
    };
  }

  /**
   * Login a user to the system. Finds user and compares passwords. On success it
   * creates a JWT to authorize requests to system.
   * @param {string} email - email
   * @param {string} password - password
   * @returns ID of user and a JWT token on success
   *  */
  async function login({ email, password }) {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throwError('User not found', 401, 'Invalid username or password');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throwError('Invalid password', 401, 'Invalid username or password');
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      config.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    return {
      name: `${user.firstName} ${user.lastName}`,
      id: user.id,
      token,
    };
  }

  return {
    signup,
    login,
  };
};
