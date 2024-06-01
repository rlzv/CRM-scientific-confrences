"use client"

import styles from "@/css/adminPanel.module.css"
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import LocationSearchBar from "./LocationSearchBar";

function getTags() {
    return [
      "BoardGame Night", 
      "PainBall", 
      "Team Building", 
      "Movie Night"
    ];
}

export default function CreateEventForm(){
    const tags = getTags();
    const [selectedTag, setSelectedTag] = useState("");

    const [users, setUsers] = useState([]);
    const [departs, setDeparts] = useState([]);

    const [InitialUsers, setInitialUsers] = useState([]);
    const [InitialGroups, setInitialGroups] = useState([]);

    const [AddPerson, setAddPeople] = useState(false);
    const [AddGroup, setAddGroup] = useState(false);

    const [People, setPeople] = useState([]);
    const [Groups, setGroups] = useState([]);

    const [SelectedPeople, setSelectedPeople] = useState([]);
    const [SelectedGroups, setSelectedGroups] = useState([]);

    const [Locatie, setLocatie] = useState(""); 

    // Get all users and groups initially
    useEffect(()=> {
        async function getUsers(){
            const userResponse = await axios.get('http://localhost:5000/user', {withCredentials:true});
            setUsers(userResponse.data.users);
            setInitialUsers(userResponse.data.users);
        }
        getUsers();
    }, []);

    useEffect(()=> {
        async function getDeparts(){
            const groupsResponse = await axios.get('http://localhost:5000/groups', {withCredentials:true});
            setDeparts(groupsResponse.data.groups);
            setInitialGroups(groupsResponse.data.groups);
        }
        getDeparts();
    }, []);

    // Update filtered users and groups when people/groups change
    useEffect(() => {
        setUsers(InitialUsers.filter((item) => !People.includes(item)));
    }, [People, InitialUsers]);

    useEffect(() => {
        setDeparts(InitialGroups.filter((item) => !Groups.includes(item)));
    }, [Groups, InitialGroups]);

    const handleUserClick = (user) => () => {
        const isUserSelected = SelectedPeople.includes(user);
        if (isUserSelected) {
            setSelectedPeople(SelectedPeople.filter((selectedUser) => selectedUser !== user));
        } else {
            setSelectedPeople([...SelectedPeople, user]);
        }
    };

    const showAddPersonClick = () => {
        setAddPeople(true);
    };

    const hideAddPersonClick = () => {
        setSelectedPeople([]);
        setAddPeople(false);
    };

    const handleAddPersonClick = () => {
        setPeople([...People, ...SelectedPeople]);
        setSelectedPeople([]);
        setAddPeople(false);
    };

    const handleGroupClick = (group) => () => {
        const isGroupSelected = SelectedGroups.includes(group);
        if (isGroupSelected) {
            setSelectedGroups(SelectedGroups.filter((selectedGroup) => selectedGroup !== group));
        } else {
            setSelectedGroups([...SelectedGroups, group]);
        }
    };

    const showAddGroupClick = () => {
        setAddGroup(true);
    };

    const hideAddGroupClick = () => {
        setSelectedGroups([]);
        setAddGroup(false);
    };

    const handleAddGroupClick = () => {
        setGroups([...Groups, ...SelectedGroups]);
        setSelectedGroups([]);
        setAddGroup(false);
    };

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const removePerson = (personToRemove) => {
        const updatedPeople = People.filter((person) => person !== personToRemove);
        setPeople(updatedPeople);
        setUsers(InitialUsers.filter((item) => !updatedPeople.includes(item)));
    };

    const removeGroup = (groupToRemove) => {
        const updatedGroups = Groups.filter((group) => group !== groupToRemove);
        setGroups(updatedGroups);
        setDeparts(InitialGroups.filter((item) => !updatedGroups.includes(item)));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const groupsUsers = [];
        const promises = Groups.map(async (group) => {
            try {
                const response = await axios.get(`http://localhost:5000/groups/${group.name}`, { withCredentials: true });
                const users = response.data.users;
                groupsUsers.push(...users);
            } catch (error) {
                console.error(`Error fetching users for group ${group.name}:`, error);
                groupsUsers.push([]);
            }
        });

        const usernamesArray = People.map(user => user.username);
        groupsUsers.push(...usernamesArray);

        Promise.all(promises).then(async () => {
            const event = {
                title: e.target.titlu.value,
                date: e.target.data.value,
                location: Locatie,
                description: e.target.descriere.value,
                tags: selectedTag,
                invites: [...new Set(groupsUsers)]
            };

            try {
                const response = await fetch('http://localhost:5000/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event),
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Request failed with status ' + response.status);
                }

                const data = await response.json();
                console.log(data);

            } catch (error) {
                console.error(error);
            }
        });
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    const handleChangeLocation = (location) => {
        setLocatie(location);
    };

    return (
        <div className={styles.formContainerEvent}>
            <form className={styles.mainForm} onSubmit={onSubmit}>

                <p>Title:</p>
                <input name="titlu" className={styles.input} type="text" />

                <p>Speaker:</p>
                <input name="titlu" className={styles.input} type="text" />

                <p>Date:</p>
                <input name="data" className={styles.input} type="datetime-local" min={getCurrentDateTime()} />

                <p>Location:</p>
                <LocationSearchBar changeLocation={handleChangeLocation} />

                <p>Description:</p>
                <input name="descriere" className={styles.input} type="text" />

                <br></br>

                <input className={styles.button} type="submit" value="Create Event" />
            </form>

            <div className={styles.sideForm}>
                {/* <p>Speaker</p>
                <div className={`${styles.containerParticipanti} ${styles.width70}`}>
                    <div className={styles.controllBtns}>
                        <div onClick={showAddPersonClick} className={styles.tagWhite}>Add Person</div>
                    </div>
                    <div className={styles.tagsContaincer}>
                        {People?.map((person) => (
                            <div key={person.id} onClick={() => removePerson(person)} className={styles.tag}>{person.username}</div>
                        ))}
                        {Groups?.map((group) => (
                            <div key={group.id} onClick={() => removeGroup(group)} className={styles.tag}>{group.name}</div>
                        ))}
                    </div>
                </div> */}

                <p>Participants</p>
                <div className={`${styles.containerParticipanti} ${styles.width70}`}>
                    <div className={styles.controllBtns}>
                        <div onClick={showAddPersonClick} className={styles.tagWhite}>Add Person</div>
                    </div>
                    <div className={styles.tagsContaincer}>
                        {People?.map((person) => (
                            <div key={person.id} onClick={() => removePerson(person)} className={styles.tag}>{person.username}</div>
                        ))}
                        {Groups?.map((group) => (
                            <div key={group.id} onClick={() => removeGroup(group)} className={styles.tag}>{group.name}</div>
                        ))}
                    </div>
                </div>

                {AddPerson && 
                    <>
                        <div className={styles.overlay}></div>
                        <div className={styles.modalContent}>
                            <div className={styles.controllContainer}>
                                <input type="search" className={`${styles.input} ${styles.searchBar}`} />
                                <input onClick={handleAddPersonClick} className={`${styles.button} ${styles.noMarg}`} type="submit" value="Add" />
                                <input onClick={hideAddPersonClick} className={`${styles.button} ${styles.noMarg}`} type="submit" value="Cancel" />
                            </div>

                            {users && <FormGroup className={styles.usersContainer}>
                                {users.map((user) => (
                                    <div key={user.id} className={styles.userCheck}>
                                        <FormControlLabel
                                            control={<Checkbox checked={SelectedPeople.includes(user)} onChange={handleUserClick(user)} />}
                                            label={user.username}
                                        />
                                    </div>
                                ))}
                            </FormGroup>}
                        </div>
                    </>
                }

                {AddGroup && 
                    <>
                        <div className={styles.overlay}></div>
                        <div className={styles.modalContent}>
                            <div className={styles.controllContainer}>
                                <input type="search" className={`${styles.input} ${styles.searchBar}`} />
                                <input onClick={handleAddGroupClick} className={`${styles.button} ${styles.noMarg}`} type="submit" value="Add" />
                                <input onClick={hideAddGroupClick} className={`${styles.button} ${styles.noMarg}`} type="submit" value="Cancel" />
                            </div>

                            {departs && <FormGroup className={styles.usersContainer}>
                                {departs.map((group) => (
                                    <div key={group.id} className={styles.userCheck}>
                                        <FormControlLabel
                                            control={<Checkbox checked={SelectedGroups.includes(group)} onChange={handleGroupClick(group)} />}
                                            label={group.name}
                                        />
                                    </div>
                                ))}
                            </FormGroup>}
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
