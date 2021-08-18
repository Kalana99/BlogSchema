const { Router } = require("express");
let router = Router();

let mainController = require('../controllers/mainController');
let {requireAuth} = require('../middleware/authMiddleware');

const uuid = require('uuid').v4;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'profilePics');
    },
    filename: (req, file, callback) => {
        const {originalname } = file;
        let fileName = uuid() + '-' + originalname;
        callback(null, fileName);
        // if(!req.body['fileName'])
        //     req.body['fileName'] = [fileName];
        // else
        //     req.body['fileName'].push(fileName);
        console.log(fileName);
        req.body.fileName = fileName;
    }
});
const upload = multer({storage});

//-------------------------------main routes-----------------------------------//

router.get('/', mainController.get_home);

router.get('/login', mainController.get_login);

router.post('/signUp', mainController.post_signUp);

router.post('/login', mainController.post_login);

router.get('/forgotPsw', mainController.get_forgotPsw);

router.post('/getPin', mainController.post_getPin);

router.get('/forgotChangePsw', mainController.get_forgotChangePsw);

router.put('/forgotChangePsw', mainController.put_forgotChangePsw);

router.get('/main', requireAuth, mainController.get_main);

router.get('/getProfilePic', requireAuth, mainController.get_profilePic);

router.post('/EditProfilePic', requireAuth, upload.single('uploadedFile'), mainController.post_editProfilePic);

router.get('/editProfile', requireAuth, mainController.get_editProfile);

router.post('/editProfile', requireAuth, mainController.post_editProfile);

router.get('/about', mainController.get_about);

router.get('/logout', mainController.get_logout);

//--------------------------------------------------------------------------------------------//

//-------------------------------blog routes--------------------------------------------------//

router.get('/newBlog', requireAuth, mainController.get_newBlog);

router.post('/newBlog', mainController.post_newBlog);

router.get('/editBlogDetails', mainController.get_editBlogDetails);

router.get('/editBlog', requireAuth, mainController.get_editBlog);

router.post('/editBlog', mainController.post_editBlog);

router.get('/myBlogs', requireAuth, mainController.get_myBlogs);

router.get('/viewBlog/:id', requireAuth, mainController.get_viewBlog);

router.get('/viewMyBlog/:id', requireAuth, mainController.get_viewMyBlog);

router.get('/deleteBlog', mainController.get_deleteBlog);

//-----------------------------------------------------------------------------------------//

module.exports = router