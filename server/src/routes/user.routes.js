import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import {register ,login , logout,
    currentUser,
    refreshAndAccessToken,
    changeNameAndEmail,
    changeName,
    changeAvatar,
    changeCoverImage,
    isValidUserName
}  from '../controllers/user.controllers.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {addList,updateList,deleteList,getTodo} from '../controllers/todolist.controllers.js'

const router =  Router()


router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    register
)
// accounting for the case for resister,login ,logout,update
router.route("/login").post(login)
router.route('/logout').post( verifyJWT,logout)
router.route('/current-user').get(verifyJWT,currentUser)
router.route('/refresh-token').get(verifyJWT,refreshAndAccessToken)
router.route('/change-detail').post(verifyJWT,changeNameAndEmail)
router.route("/change-name").patch(verifyJWT,changeName)
router.route('/change-avatar').patch(verifyJWT,upload.single("avatar"),changeAvatar)
router.route("/change-cover-image").patch(verifyJWT,upload.single('coverImage'),changeCoverImage)
router.route("/isvalid-username").post(isValidUserName)

// todo controllers set up

router.route('/dashboard').get((req,res)=>{
    res.send('todo list')
})
router.route('/dashboard/get-list').get(verifyJWT,getTodo)
router.route('/dashboard/add-list').post(verifyJWT,addList)
router.route('/dashboard/update-list').patch(verifyJWT,updateList)
router.route('/dashboard/delete-list').delete(verifyJWT,deleteList)


export {router}