import styled from "../../css/eventCard.module.css"
import styles from "@/app/admin/admin.module.css";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import React, {useState} from "react";



function getUsers(){

    // tr inlocuit cu get/users (care nu sunt admins) 

    return [
        {
            "_id": "64b280a0d6e3fa7e1eaefa9a",
            "username": "robi@gmail.com",
            "password": "$2b$10$fZBvSD17VH5M2vv5r0IqTOovQJJmLjX2wwOyVlIbJrNIOVQoUAWl.",
            "role": "user",
            "__v": 0
        }
    ]
}

function getAdmins(){

    // tr inlocuit cu get/admins

    return [
        {
            "_id": "64ba73ce64d893836defb8f8",
            "username": "altcont",
            "password": "$2b$10$mgZH4kl8P7DifHiA26uzxeaF7LUCY1NZlg00isvqIAC/V0pGWShAC",
            "role": "user",
            "__v": 0
        }
    ]
}

export default function ManageAdmins(){

    const [Users, setUsers] = useState(getUsers());
    const [Admins, setAdmins] = useState(getAdmins());
    const [SelectedUsers, setSelectedUsers] = useState([]);

    const [AddAdmin, setAddAdmin] = useState(false);
    const [DeleteAdmin, setDeleteAdmin] = useState(false);
    const [SelectedAdmin, setSelectedAdmin] = useState(null);


    const hideAddGroupClick = () => {
        setSelectedUsers([])
        setAddAdmin(false);
    };

    const showAddGroupClick = () => {
        setSelectedUsers([])
        setAddAdmin(true);
    };

    const hideDeleteAdminClick = () => {
        setSelectedUsers(null)
        setDeleteAdmin(false);
    };

    const showDeleteAdminClick = (admin) => {
        setSelectedAdmin(admin)
        setDeleteAdmin(true);
    };

    const handleUserClick = (user) => (event) => {
        const isUserSelected = SelectedUsers.includes(user);

        if (isUserSelected) {
            setSelectedUsers(Admins.filter((selectedUser) => selectedUser !== user));
        } else {
            setSelectedUsers([...SelectedUsers, user]);
        }
    };

    const handleDeleteAdmin = () => {

        console.log(SelectedAdmin) // change roles from admin -> user

        setUsers([...Users, SelectedAdmin])
        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin !== SelectedAdmin));

        setSelectedAdmin(null)
        setDeleteAdmin(false);
    }

    const handleAddGroupClick = () =>{

        console.log(SelectedUsers); // change users roles from user -> admin

        setUsers((prevUsers) => prevUsers.filter((user) => !SelectedUsers.includes(user)));
        setAdmins([...Admins, ...SelectedUsers])
        setSelectedUsers([])
        setAddAdmin(false);
    }


    return<>

        <div className={styled.event}>
            <button onClick={showAddGroupClick} id={styled.create}>Add Admin</button>
            <div className={styled.Dept}>                
                {Admins && Admins.map((admin)=>(
                    <button onClick={() => showDeleteAdminClick(admin) } key={admin._id} className={styled.acceptBtn} >{admin.username}</button>
                ))
                }
            </div>
        </div>

        
        {/* ---------------------- Overlay Add Admin ---------------------- */}

        {AddAdmin && 
            <>
                <div className={styles.overlay}></div>
                <div className={styles.modalContent}>
                    
                    <div className={styles.controllContainer}>
                        <input
                            type="search"
                            className={`${styles.input} ${styles.searchBar}`}
                        />
                        <input onClick={handleAddGroupClick} className={`${styles.button} ${styles.noMarg} ${styles.margTop}`} type="submit" value="Add" />
                        <input onClick={hideAddGroupClick} className={`${styles.button} ${styles.noMarg} ${styles.margTop}`} type="submit" value="Cancel" />
                    </div>

                    {Users && <FormGroup className={styles.usersContainer}>
                        {Users.map((user) => (
                            <div key={user._id} className={styles.userCheck}>
                                <FormControlLabel control={<Checkbox
                                    checked={SelectedUsers.includes(user)}
                                    onChange={handleUserClick(user)}
                                />
                                } label={user.username} />
                            </div>
                        ))}
                    </FormGroup>
                    }
                </div>
            </>
        }

        {/* ---------------------- Overlay Delete Admin ---------------------- */}

        {DeleteAdmin && 
            <>
                <div className={styles.overlay}></div>
            
                <div className={`${styles.modalContent} ${styles.deletePopUp}`}>
                    
                    <h1 className={styles.textP}>Are you sure that you want to remove {SelectedAdmin.username} from Admins?</h1>
                    <div className={styles.controllContainer}>
                        <input onClick={handleDeleteAdmin} className={`${styles.button} ${styles.noMarg} ${styles.margTop} ${styles.bgRed}`} type="submit" value="Delete" />
                        <input onClick={hideDeleteAdminClick} className={`${styles.button} ${styles.noMarg} ${styles.margTop}`} type="submit" value="Cancel" />
                    </div>
                    
                </div>
            </>
        }


    </>
}