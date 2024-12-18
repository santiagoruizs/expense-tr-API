const express = require('express');
const router = express.Router();
const { addExpenseToUser, addIncomeToUser, getUserBalance, getCategories, getMovements, getMonthExpensesByCategory, getWeekExpensesByCategory, getDayExpensesByCategory, editExpense, editIncome} = require('../models/Movements');


//====================================get User Balance================================
router.get('/balance/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try{
        const balance = await getUserBalance(user_id)
        res.status(200).json(balance);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================Register expense================================
router.post('/expense', async (req, res) => {
    const {user_id, category_id, amount, description, expense_date} = req.body
    //const parsedAmount = parseFloat(ammount)
    try{
        const newBalance = await addExpenseToUser(user_id, category_id, amount, description, expense_date)
        res.status(200).json({ message: 'Expense added'});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================Register Income================================
router.post('/income', async (req, res) => {
    const {user_id, category_id, amount, description, expense_date} = req.body
    try{
        const newBalance = await addIncomeToUser(user_id, category_id, amount, description, expense_date)
        res.status(200).json({ message: 'Income added'});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================get Categories================================
router.get('/categories', async (req, res) => {
    try{
        const categories = await getCategories()
        res.status(200).json(categories);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================get Movements================================
router.get('/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try{
        const categories = await getMovements(user_id)
        res.status(200).json(categories);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================get Month Expenses================================
router.get('/expenses/month/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try{
        const categories = await getMonthExpensesByCategory(user_id)
        res.status(200).json(categories);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================get Week Expenses================================
router.get('/expenses/week/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try{
        const categories = await getWeekExpensesByCategory(user_id)
        res.status(200).json(categories);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================get Day Expenses================================
router.get('/expenses/day/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try{
        const categories = await getDayExpensesByCategory(user_id)
        res.status(200).json(categories);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
//====================================Edit Expense================================
router.put('/expense/:expense_id', async (req, res) => {
    const expense_id = req.params.expense_id
    const {category_id, amount, description} = req.body
    console.log()
    try{
        const data = await editExpense(expense_id, category_id, amount, description)
        res.status(200).json({message: 'Expense record updated'});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});

//====================================Edit Income================================
router.put('/income/:income_id', async (req, res) => {
    const income_id = req.params.income_id
    const {category_id, amount, description} = req.body
    try{
        const data = await editIncome(income_id, category_id, amount, description)
        res.status(200).json({message: 'Income record updated'});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});



module.exports = router;