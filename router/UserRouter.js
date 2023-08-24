import express from 'express'
import User from '../Schema/UserSchema.js'
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
import authMiddleware from '../Middleware/authMiddleware.js'
const UserRouter = express.Router()

UserRouter.post('/Register',async(req,res)=>{
    const {password,name,email}=req.body
   
    
    try {
        //Check if User Exists
        const existingUser = await User.findOne({name});
        if(existingUser){
            return res.status(400).json({error: 'User with this name already exists'})
        }
        //Generate a salt
        const salt = await bcrypt.genSalt(10)
        //Hash the password
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const user= await User.create({name, email,password:hashedPassword})
       
        res.json({message:'Registration successful proceed to Login',user})


} catch (error) {
    res.status(500).json({ msg: 'An error occurred during user registration' ,error});
    
}
})



UserRouter.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // If the password is valid, sign a token and send it in the response
    const token = jwt.sign({ userId: user._id }, process.env.SecretKey, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during user login',error });
  }
});



UserRouter.post('/protected-route', authMiddleware, async (req, res) => {

  try {
    // Example of accessing the user ID from the authenticated request
    const user = await User.findById(req.user);
    // ... Your logic for the protected route ...
    res.json({ message: 'This is a protected route', user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during processing' });
  }
});

// Protected route using authMiddleware



export default UserRouter