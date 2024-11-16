const { pool } = require("../config/db");
//const {logTransaction} = require('./Transactions')
async function getUserBalance(userId) {
  try{

    const query =
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS balance
        FROM (
            SELECT amount, 'income' AS type FROM income WHERE user_id = $1
            UNION ALL
            SELECT amount, 'expense' AS type FROM expenses WHERE user_id = $1
        ) AS combined;`;
    const values = [userId];
    const res = await pool.query(query, values);
    return res.rows[0];
  }catch(err){
    console.error('Error getting user balance:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}
async function addExpenseToUser(userId, category_id, amount, description, expense_date) {
  try{

    const query =
      "INSERT INTO expenses (user_id, category_id, amount, description, expense_date) VALUES ($1, $2, $3, $4, NOW())";
    const values = [userId, category_id, amount, description];
    const res = await pool.query(query, values);
    return res.rows[0];
  }catch(err){
    console.error('Error adding an expense:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}
async function addIncomeToUser(userId, category_id, amount, description, expense_date) {
  try{

    const query =
      "INSERT INTO income (user_id, category_id, amount, description, income_date) VALUES ($1, $2, $3, $4, NOW())";
    const values = [userId, category_id, amount, description];
    const res = await pool.query(query, values);
    return res.rows[0];
  }catch(err){
    console.error('Error adding an income:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}
async function getCategories() {
  try{
    const query =
      "Select * from categories";
    const res = await pool.query(query);
    return res.rows;
  }catch(err){
    console.error('Error geting categories:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function getMovements(user_id) {
  try{
    const query =
      `Select i.created_at datetime, c.name, i.amount, i.description, c.type   from income i 
          inner join categories c on c.category_id = i.category_id 
          where i.user_id = $1 
      union
      Select e.created_at datetime, c.name, e.amount, e.description, c.type from expenses e 
          inner join categories c on c.category_id = e.category_id 
          where e.user_id = $1
      order by datetime desc`;
    const values  = [user_id]
    const res = await pool.query(query, values);
    return res.rows;
  }catch(err){
    console.error('Error geting categories:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function getDayExpensesByCategory(user_id) {
  try{
    const query =
      `Select c.name, SUM(e.amount) from expenses e 
        inner join categories c on c.category_id = e.category_id 
        where e.user_id = $1	AND CAST(NOW() as Date) = e.expense_date
        group by c.name`;
    const values  = [user_id]
    const res = await pool.query(query, values);
    return res.rows;
  }catch(err){
    console.error('Error geting categories:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function getWeekExpensesByCategory(user_id) {
  try{
    const query =
      `Select c.name, SUM(e.amount) from expenses e 
        inner join categories c on c.category_id = e.category_id 
        where e.user_id = $1	AND DATE_PART('week', e.expense_date) = DATE_PART('week', Now())
        group by c.name`;
    const values  = [user_id]
    const res = await pool.query(query, values);
    return res.rows;
  }catch(err){
    console.error('Error geting categories:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function getMonthExpensesByCategory(user_id) {
  try{
    const query =
      `Select c.name, SUM(e.amount) from expenses e 
        inner join categories c on c.category_id = e.category_id 
        where e.user_id = $1	AND DATE_PART('month', e.expense_date) = DATE_PART('month', Now())
        group by c.name`;
    const values  = [user_id]
    const res = await pool.query(query, values);
    return res.rows;
  }catch(err){
    console.error('Error geting categories:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}



module.exports = {
  getUserBalance,
  addExpenseToUser,
  addIncomeToUser,
  getCategories,
  getMovements,
  getDayExpensesByCategory,
  getWeekExpensesByCategory,
  getMonthExpensesByCategory
};
