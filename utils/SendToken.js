const sendToken = async (user, res, statusCode) => {
  const token = await user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //save in cookie
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    accessToken: token,
  });
};
module.exports = sendToken;
