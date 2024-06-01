"use client"

import styles from "@/css/adminPanel.module.css";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState, useEffect } from "react";
import axios from 'axios';

// Replace with your actual API endpoint
const API_URL = "http:/localhost:3000/events/:id";

// Fetch users function (mocked for now)
function getUsers() {
    return [
        "user 1",
        "user 2",
        "user 3",
        "user 4",
        "user 5"
    ];
}

export default function EditEventForm() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [users, setUsers] = useState(getUsers());
    const [addPerson, setAddPerson] = useState(false);
    const [people, setPeople] = useState([]);
    const [selectedPeople, setSelectedPeople] = useState([]);

    useEffect(() => {
        // Fetch events from the database when component mounts
        async function loadEvents() {
            try {
                const response = await axios.get(API_URL);
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
        loadEvents();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            setPeople(selectedEvent.users);
            setUsers(getUsers().filter((item) => !selectedEvent.users.includes(item)));
        }
    }, [selectedEvent]);

    const handleUserClick = (user) => (event) => {
        const isUserSelected = selectedPeople.includes(user);

        if (isUserSelected) {
            setSelectedPeople(selectedPeople.filter((selectedUser) => selectedUser !== user));
        } else {
            setSelectedPeople([...selectedPeople, user]);
        }
    };

    const showAddPersonClick = () => {
        setAddPerson(true);
    };

    const hideAddPersonClick = () => {
        setSelectedPeople([]);
        setAddPerson(false);
    };

    const handleAddPersonClick = () => {
        setPeople([...people, ...selectedPeople]);
        setSelectedPeople([]);
        setAddPerson(false);
    };

    const removePerson = (personToRemove) => {
        const updatedPeople = people.filter((person) => person !== personToRemove);
        setPeople(updatedPeople);
        setUsers(getUsers().filter((item) => !updatedPeople.includes(item)));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const eventSubmit = {
            id: selectedEvent.id,
            titlu: e.target.titlu.value,
            data: e.target.data.value,
            locatie: e.target.locatie.value,
            descriere: e.target.descriere.value,
            users: people
        };

        try {
            await axios.put(`${API_URL}/${selectedEvent.id}`, eventSubmit);
            console.log("Event updated successfully");
            // Optionally, refresh the events list after update
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    return (
        <div className={styles.formContainerEvent}>
            {!selectedEvent ? (
                <div className={styles.eventList}>
                    <h3>Select an Event to Edit</h3>
                    {events.map((event) => (
                        <div key={event.id} className={styles.eventItem} onClick={() => setSelectedEvent(event)}>
                            {event.titlu}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <form className={styles.mainForm} onSubmit={onSubmit}>
                        <p>Titlu</p>
                        <input name="titlu" className={styles.input} type="text" defaultValue={selectedEvent.titlu} />

                        <p>Data</p>
                        <input name="data" className={styles.input} type="datetime-local" defaultValue={selectedEvent.data} />

                        <p>Locatie</p>
                        <input name="locatie" className={styles.input} type="text" defaultValue={selectedEvent.locatie} />

                        <p>Descriere</p>
                        <input name="descriere" className={styles.input} type="text" defaultValue={selectedEvent.descriere} />

                        <br />

                        <input className={styles.button} type="submit" value="Edit Event" />
                    </form>

                    <div className={styles.sideForm}>
                        <p>Participants</p>
                        <div className={styles.containerParticipanti}>
                            <div className={styles.controllBtns}>
                                <div onClick={showAddPersonClick} className={styles.tagWhite}>Add Person</div>
                            </div>
                            <div className={styles.tagsContaincer}>
                                {people.map((person) => (
                                    <div key={person} onClick={() => removePerson(person)} className={styles.tag}>{person}</div>
                                ))}
                            </div>
                        </div>

                        {addPerson && (
                            <>
                                <div className={styles.overlay}></div>
                                <div className={styles.modalContent}>
                                    <div className={styles.controllContainer}>
                                        <input type="search" className={`${styles.input} ${styles.searchBar}`} />
                                        <input onClick={handleAddPersonClick} className={`${styles.button} ${styles.noMarg}`} type="submit" value="Add" />
                                        <input onClick={hideAddPersonClick} className={`${styles.button} ${styles.noMarg}`} type="submit" value="Cancel" />
                                    </div>

                                    {users && (
                                        <FormGroup className={styles.usersContainer}>
                                            {users.map((user) => (
                                                <div key={user} className={styles.userCheck}>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={selectedPeople.includes(user)} onChange={handleUserClick(user)} />}
                                                        label={user}
                                                    />
                                                </div>
                                            ))}
                                        </FormGroup>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
