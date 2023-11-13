const jwt = require('jsonwebtoken');

const requireAuthusername = (req, res, next) => {
  const token = req.cookies.jwt;
  const { username } = req.params;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        res.status(405).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
        if (decodedToken && decodedToken.name === username) {
          console.log('Token is for the right user.');
        } else {
          console.log(decodedToken);
          return res.status(406).json({message:"You are not the right user."})
        }
        next();
      }
    });
  } else {
    res.status(401).json({message:"You are not logged in."})
  }
};

const requireAuthUsername = (req, res, next) => {
  const token = req.cookies.jwt;
  const { Username } = req.params;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        res.status(405).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
        
        if (decodedToken && decodedToken.name === Username) {
          console.log('Token is for the right user.');
        } else {
          return res.status(406).json({message:"You are not the right user."})
        }
        next();
      }
    });
  } else {
    res.status(401).json({message:"You are not logged in."})
  }
};

const requireAuthEmail = (req, res, next) => {
  const token = req.cookies.jwt;
  const { Email } = req.body;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (err) {
        // console.log('You are not logged in.');
        // res send status 401 you are not logged in
        res.status(405).json({message:"You are not logged in."})
        // res.redirect('/login');
      } else {
        
        if (decodedToken && decodedToken.email === Email) {
          console.log('Token is for the right user.');
        } else {
          return res.status(406).json({message:"You are not the right user."})
        }
        next();
      }
    });
  } else {
    res.status(401).json({message:"You are not logged in."})
  }
};

module.exports = { 
  requireAuthusername,
  requireAuthEmail,
  requireAuthUsername };
