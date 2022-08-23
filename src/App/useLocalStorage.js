import React from 'react'

function useLocalStorage(itemName, initialValue) {
    const [state, dispatch] = React.useReducer(
        reducer,
        initialState({ initialValue })
    )
    const { sincronizedItem, error, loading, item } = state

    //ACCTION
    const onError = (error) =>
        dispatch({ type: actionTypes.ERROR, payload: error })

    const onSuccess = (parsedItem) =>
        dispatch({ type: actionTypes.SUCCESS, payload: parsedItem })

    const onSave = (item) => dispatch({ type: actionTypes.SAVE, payload: item })

    const onSincronize = () => dispatch({ type: actionTypes.SINCRONIZE })

    React.useEffect(() => {
        setTimeout(() => {
            try {
                const localStorageItem = localStorage.getItem(itemName)
                let parsedItem

                if (!localStorageItem) {
                    localStorage.setItem(itemName, JSON.stringify(initialValue))
                    parsedItem = initialValue
                } else {
                    parsedItem = JSON.parse(localStorageItem)
                }
                onSuccess(parsedItem)
            } catch (error) {
                onError(error)
                // setError(error)
            }
        }, 3000)
    }, [sincronizedItem])

    const saveItem = (newItem) => {
        try {
            const stringifiedItem = JSON.stringify(newItem)
            localStorage.setItem(itemName, stringifiedItem)
            //setItem(newItem)
            onSave(newItem)
        } catch (error) {
            onError(error)
            // setError(error)
        }
    }

    const sincronizeItem = () => {
        onSincronize()
        // setLoading(true)
        // setSincronizedItem(false)
    }

    return {
        item,
        saveItem,
        loading,
        error,
        sincronizeItem,
    }
}

const initialState = ({ initialValue }) => ({
    sincronizedItem: true,
    error: false,
    loading: true,
    item: initialValue,
})

const actionTypes = {
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
    SAVE: 'SAVE',
    SINCRONIZE: 'SINCRONIZE',
}

const reducerObject = (state, payload) => ({
    [actionTypes.ERROR]: {
        ...state,
        error: true,
    },
    [actionTypes.SUCCESS]: {
        ...state,
        error: false,
        loading: false,
        sincronizedItem: true,
        item: payload,
    },
    [actionTypes.SAVE]: {
        ...state,
        item: payload,
    },
    [actionTypes.SINCRONIZE]: {
        ...state,
        loading: true,
        sincronizedItem: false,
    },
})

const reducer = (state, action) => {
    return reducerObject(state, action.payload)[action.type] || state
}

export { useLocalStorage }
