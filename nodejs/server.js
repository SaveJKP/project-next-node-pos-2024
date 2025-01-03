const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

const userController = require('./controllers/UserController')
const foodTypeController = require('./controllers/FoodTypeController');
const foodSizeController = require('./controllers/FoodSizeController');
const tasteController = require('./controllers/TasteController');
const foodController = require('./controllers/FoodController');
const saleTempController = require('./controllers/SaleTempController');
const organizationController = require('./controllers/OrganizationController');
const billSaleController = require('./controllers/BillSaleController');
const reportController = require('./controllers/ReportController');
const saleTempDetailController = require('./controllers/SaleTempDetailController');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const isAuthen = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1]; // Bearer token example "Bearer tsdsdfsdf9svdf"
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (decoded) {
                next();
            } else {
                return res.status(401).send({ error: 'Unauthorized' });
            }
        } catch (e) {
            return res.status(401).send(e.message);
        }
    } else {
        return res.status(401).send({ error: 'Unauthorized' });
    }
}

//
// report
//
app.post('/api/report/sumPerMonthInYear',isAuthen, (req, res) => reportController.sumPerMonthInYear(req, res));
app.post('/api/report/sumPerDayInYearAndMonth', isAuthen, (req, res) => reportController.sumPerDayInYearAndMonth(req, res));

//
// billSale
//
app.post('/api/billSale/list', (req, res) => billSaleController.list(req, res));
app.delete('/api/billSale/remove/:id', (req, res) => billSaleController.remove(req, res));

//
// organization
//
app.post('/api/organization/create', (req, res) => organizationController.create(req, res));
app.get('/api/organization/info', (req, res) => organizationController.info(req, res));
app.post('/api/organization/upload', (req, res) => organizationController.upload(req, res));

//
// saleTemp
//
app.get('/api/saleTemp/list', (req, res) => saleTempController.list(req, res));
app.post('/api/saleTemp/printBillAfterPay', (req, res) => saleTempController.printBillAfterPay(req, res));
app.post('/api/saleTemp/endSale', (req, res) => saleTempController.endSale(req, res));
app.post('/api/saleTemp/printBillBeforePay', (req, res) => saleTempController.printBillBeforePay(req, res));
app.post('/api/saleTemp/create', (req, res) => saleTempController.create(req, res));
app.put('/api/saleTemp/updateQty', (req, res) => saleTempController.updateQty(req, res));
app.delete('/api/saleTemp/removeAll', (req, res) => saleTempController.removeAll(req, res));
app.delete('/api/saleTemp/remove/:id', (req, res) => saleTempController.remove(req, res));

//
// saleTempDetail
//
app.get('/api/saleTemp/info/:id', (req, res) => saleTempController.info(req, res));
app.post('/api/saleTempDetail/createForQty', (req, res) => saleTempDetailController.createForQty(req, res));
app.post('/api/saleTempDetail/create', (req, res) => saleTempDetailController.create(req, res));
app.put('/api/saleTempDetail/selectTaste', (req, res) => saleTempDetailController.selectTaste(req, res));
app.put('/api/saleTempDetail/unselectTaste', (req, res) => saleTempDetailController.unselectTaste(req, res));
app.put('/api/saleTempDetail/selectSize', (req, res) => saleTempDetailController.selectSize(req, res));
app.put('/api/saleTempDetail/unselectSize', (req, res) => saleTempDetailController.unselectSize(req, res));
app.delete('/api/saleTempDetail/remove', (req, res) => saleTempDetailController.remove(req, res));

//
// food
//
app.post('/api/food/paginate', (req, res) => foodController.paginate(req, res));
app.get('/api/food/filter/:foodType', (req, res) => foodController.filter(req, res));
app.put('/api/food/update', (req, res) => foodController.update(req, res));
app.delete('/api/food/remove/:id', (req, res) => foodController.remove(req, res));
app.get('/api/food/list', (req, res) => foodController.list(req, res));
app.post('/api/food/upload', (req, res) => foodController.upload(req, res));
app.post('/api/food/create', (req, res) => foodController.create(req, res));

//
// taste
//
app.put('/api/taste/update', (req, res) => tasteController.update(req, res));
app.delete('/api/taste/remove/:id', (req, res) => tasteController.remove(req, res));
app.get('/api/taste/list', (req, res) => tasteController.list(req, res));
app.post('/api/taste/create', (req, res) => tasteController.create(req, res));

//
// foodSize
//
app.put('/api/foodSize/update', (req, res) => foodSizeController.update(req, res));
app.delete('/api/foodSize/remove/:id', (req, res) => foodSizeController.remove(req, res));
app.get('/api/foodSize/list', (req, res) => foodSizeController.list(req, res));
app.post('/api/foodSize/create', (req, res) => foodSizeController.create(req, res));

//
// foodType
//
app.put('/api/foodType/update', (req, res) => foodTypeController.update(req, res));
app.delete('/api/foodType/remove/:id', (req, res) => foodTypeController.remove(req, res))
app.get('/api/foodType/list', (req, res) => foodTypeController.list(req, res));
app.post('/api/foodType/create', (req, res) => foodTypeController.create(req, res));

// 
// user
//
app.get('/api/user/getLevelByToken', (req, res) => userController.getLevelByToken(req, res));
app.post('/api/user/create', (req, res) => userController.create(req, res));
app.get('/api/user/list', (req, res) => userController.list(req, res));
app.put('/api/user/update', (req, res) => userController.update(req, res));
app.delete('/api/user/remove/:id', (req, res) => userController.remove(req, res));
app.post('/api/user/signIn', (req, res) => userController.signIn(req, res))

app.listen(3001, () => {
    console.log('API Server Running on Port 3001');
});