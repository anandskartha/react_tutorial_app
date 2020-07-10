import React, { createContext, useReducer, useContext } from 'react'
import axios from 'axios'
import { TransactionReducer } from './Reducer'

import { GlobalContext } from './GlobalState'

//Initial state
const initialState = {
    transactions: [],
};

//Create a Global context
export const TransactionContext = createContext(initialState)

//Global Provider Component
export const TransactionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(TransactionReducer, initialState)
    const { setProgress, showAlert } = useContext(GlobalContext)

    //Actions
    async function getTransactions() {
        try {
            setProgress(true);
            const res = await axios.get('api/v1/transactions');
            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: res.data.data
            });
        } catch (err) {
            showAlert({
                visible: true,
                message: 'Something went wrong. Please contact the administrator if the issue persists.',
                type: 'ERROR'
            });
        } finally {
            setProgress(false);
        }
    }

    async function deleteTransaction(id) {
        try {
            setProgress(true);
            await axios.delete(`/api/v1/transactions/${id}`);
            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id
            })
        } catch (err) {
            showAlert({
                visible: true,
                message: 'Something went wrong. Please contact the administrator if the issue persists.',
                type: 'ERROR'
            });
        } finally {
            setProgress(false);
        }
    }
    async function addTransaction(transaction) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        setProgress(true);
        try {
            const res = await axios.post('/api/v1/transactions/', transaction, config);
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data.data
            })
        } catch (err) {
            showAlert({
                visible: true,
                message: 'Something went wrong. Please contact the administrator if the issue persists.',
                type: 'ERROR'
            });
        } finally {
            setProgress(false);
        }
    }

    async function editTransaction(transaction) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        setProgress(true);
        try {
            await axios.put(`/api/v1/transactions/${transaction._id}`, transaction, config);
            // dispatch({
            //     type: 'EDIT_TRANSACTION',
            //     payload: res.data.data
            // })
        } catch (err) {
            showAlert({
                visible: true,
                message: 'Something went wrong. Please contact the administrator if the issue persists.',
                type: 'ERROR'
            });
        } finally {
            setProgress(false);
        }
    }

    return (
        <TransactionContext.Provider value={{
            transactions: state.transactions,
            getTransactions,
            deleteTransaction,
            addTransaction,
            editTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    )
}