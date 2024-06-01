import styles from "../../css/eventCard.module.css"
import { formatDate } from "@/utils/dateFormater"

export default function EventDetails({title, date, location, description, speaker}){
    return <div className={styles.details}>
        <p>Title: {title}</p>
        <p>Speaker: {speaker}</p>
        <p>Date: {formatDate(date)}</p>
        <p>Location: {location}</p>
        <p>Description: {description}</p>
    </div>
}