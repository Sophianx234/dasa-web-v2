import bcrypt from 'bcrypt'
const saltRounds = 10
export const encryptPassword = async(pass:string)=>{
   const hashedPassword = await bcrypt.hash(pass, saltRounds);
   return hashedPassword
}


export const verifyPassword = async(plainPass:string,hashedPass:string) =>{
 const isPasswordCorrect =  await bcrypt.compare(plainPass,hashedPass)
 return isPasswordCorrect
}