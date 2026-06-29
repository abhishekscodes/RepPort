document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const studentListEl = document.getElementById('student-list');
    const statPresent = document.getElementById('stat-present');
    const statAbsent = document.getElementById('stat-absent');
    const statOnDuty = document.getElementById('stat-onduty');

    const displayMonth = document.getElementById('display-month');
    const displayDay = document.getElementById('display-day');
    const dateInput = document.getElementById('date');
    const greetingText = document.getElementById('greeting-text');

    const generateBtn = document.getElementById('generate-btn');
    const shareBtn = document.getElementById('share-btn');
    const editListBtn = document.getElementById('edit-list-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveListBtn = document.getElementById('save-list-btn');
    const editModal = document.getElementById('edit-modal');
    const classTextarea = document.getElementById('class-textarea');
    const toast = document.getElementById('toast');

    // Default Class Data (from user provided list 1-62)
    const defaultClassList = [
        "AAKASH G", "AARYAA M", "ABARNA R", "ABDUL HAMEED A", "ABHINAYA S",
        "ABHISHEK KUMARAN A J", "ABINASH E M", "ABINAYA B", "ABIRAMI K",
        "ABIRAMI S", "AMIRTHA G", "ANGAYARKANNI K", "ARASU J", "ARUN D",
        "ARUN KUMAR C K", "ASHVIKAA S", "ASHWIN M", "ASWANTH SOLAI A",
        "AZARUDEEN N", "AZHAGUMANIKKI A", "BALAKRISHNAN M S", "BASHARATH S",
        "BASSIL M", "BENALITHA CATHERINE S", "BHARATH KUMAR J", "BHAVADHARANI R",
        "BOOPATHIRAJ K", "CREFLO JOSHUA J", "DANIEL JAYAKARAN J", "DANIEL S",
        "DAVID MELVIN P", "DAVIDSON T", "DEEREJ WARSAN S", "DEVASRI J",
        "DHANABALAN P", "DHARSHINI R", "DIVYA K", "ELAMATHI AJITHA M",
        "ESWAR K B", "FAZIA S", "GANESH B", "GHOUSE AFSAL I", "GIJO MICHAEL STEPHAN J",
        "GOHUL HARIS V", "GOKILAVANI P R", "GOWSIGA M", "GRACE RAJ P",
        "GUHAN D", "HARIHARA ARAVINDHAN T", "HARIHARAN N", "HASANA FRADHOUS S",
        "HEMADHARSINI M A", "HEMAPRASATHA A", "HIMESH M", "IRENE PRICILLA A",
        "ISHA GANESH G", "IYOKA VIGNESHWARAH R R", "JABINA S", "JAFINA ZEENATH M",
        "PACKYARAJ R", "SACHIN S", "SANGARESH M"
    ];

    const genderMap = {
        "AAKASH G": "M", "AARYAA M": "M", "ABARNA R": "F", "ABDUL HAMEED A": "M", "ABHINAYA S": "F",
        "ABHISHEK KUMARAN A J": "M", "ABINASH E M": "M", "ABINAYA B": "F", "ABIRAMI K": "F",
        "ABIRAMI S": "F", "AMIRTHA G": "F", "ANGAYARKANNI K": "F", "ARASU J": "M", "ARUN D": "M",
        "ARUN KUMAR C K": "M", "ASHVIKAA S": "F", "ASHWIN M": "M", "ASWANTH SOLAI A": "M",
        "AZARUDEEN N": "M", "AZHAGUMANIKKI A": "F", "BALAKRISHNAN M S": "M", "BASHARATH S": "F",
        "BASSIL M": "M", "BENALITHA CATHERINE S": "F", "BHARATH KUMAR J": "M", "BHAVADHARANI R": "F",
        "BOOPATHIRAJ K": "M", "CREFLO JOSHUA J": "M", "DANIEL JAYAKARAN J": "M", "DANIEL S": "M",
        "DAVID MELVIN P": "M", "DAVIDSON T": "M", "DEEREJ WARSAN S": "M", "DEVASRI J": "F",
        "DHANABALAN P": "M", "DHARSHINI R": "F", "DIVYA K": "F", "ELAMATHI AJITHA M": "F",
        "ESWAR K B": "M", "FAZIA S": "F", "GANESH B": "M", "GHOUSE AFSAL I": "M", "GIJO MICHAEL STEPHAN J": "M",
        "GOHUL HARIS V": "M", "GOKILAVANI P R": "F", "GOWSIGA M": "F", "GRACE RAJ P": "M",
        "GUHAN D": "M", "HARIHARA ARAVINDHAN T": "M", "HARIHARAN N": "M", "HASANA FRADHOUS S": "F",
        "HEMADHARSINI M A": "F", "HEMAPRASATHA A": "M", "HIMESH M": "M", "IRENE PRICILLA A": "F",
        "ISHA GANESH G": "F", "IYOKA VIGNESHWARAH R R": "M", "JABINA S": "F", "JAFINA ZEENATH M": "F",
        "PACKYARAJ R": "M", "SACHIN S": "M", "SANGARESH M": "M"
    };

    // State
    let students = [];
    let absentStudents = new Set();
    let ondutyStudents = new Set();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function toProperCase(str) {
        return str.split(' ').map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }

    function init() {
        // Init Date
        const today = new Date();
        setDateDisplay(today);

        // Format for input YYYY-MM-DD
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        dateInput.value = `${yyyy}-${mm}-${dd}`;

        // Set greeting based on time
        const hour = today.getHours();
        if (hour < 12) greetingText.textContent = "Good Morning.";
        else if (hour < 18) greetingText.textContent = "Good Afternoon.";
        else greetingText.textContent = "Good Evening.";

        // Load list from local storage or use default
        const storedList = localStorage.getItem('fullClassList');
        const rawList = storedList ? JSON.parse(storedList) : defaultClassList;
        students = rawList.map(toProperCase);

        renderList();
        updateStats();
    }

    function setDateDisplay(dateObj) {
        displayMonth.textContent = months[dateObj.getMonth()];
        displayDay.textContent = dateObj.getDate();
    }

    dateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            const selectedDate = new Date(e.target.value);
            setDateDisplay(selectedDate);
        }
    });

    function renderList() {
        studentListEl.innerHTML = '';

        students.forEach((name, index) => {
            const item = document.createElement('div');
            const isAbsent = absentStudents.has(name);
            const isOnDuty = ondutyStudents.has(name);
            item.className = `student-item ${isAbsent ? 'absent' : ''} ${isOnDuty ? 'onduty' : ''}`;

            // Checkbox Circle
            const checkbox = document.createElement('div');
            checkbox.className = 'student-checkbox';

            // Name
            const nameSpan = document.createElement('span');
            nameSpan.className = 'student-name';
            nameSpan.textContent = `${index + 1}. ${name}`; // include number from array index

            // Tag
            const tagSpan = document.createElement('span');
            tagSpan.className = 'student-tag';
            tagSpan.textContent = isAbsent ? '#absent' : (isOnDuty ? '#on-duty' : '#present');

            item.appendChild(checkbox);
            item.appendChild(nameSpan);
            item.appendChild(tagSpan);

            item.addEventListener('click', () => {
                toggleState(name);
                const nowAbsent = absentStudents.has(name);
                const nowOnDuty = ondutyStudents.has(name);
                item.className = `student-item ${nowAbsent ? 'absent' : ''} ${nowOnDuty ? 'onduty' : ''}`;
                tagSpan.textContent = nowAbsent ? '#absent' : (nowOnDuty ? '#on-duty' : '#present');
                updateStats();
            });

            studentListEl.appendChild(item);
        });
    }

    function toggleState(name) {
        if (!absentStudents.has(name) && !ondutyStudents.has(name)) {
            // Present -> Absent
            absentStudents.add(name);
        } else if (absentStudents.has(name)) {
            // Absent -> On-Duty
            absentStudents.delete(name);
            ondutyStudents.add(name);
        } else if (ondutyStudents.has(name)) {
            // On-Duty -> Present
            ondutyStudents.delete(name);
        }
    }

    function updateStats() {
        const total = students.length;
        const absentCount = absentStudents.size;
        const ondutyCount = ondutyStudents.size;
        const presentCount = total - absentCount - ondutyCount;

        statPresent.textContent = presentCount;
        statAbsent.textContent = absentCount;
        if (statOnDuty) statOnDuty.textContent = ondutyCount;
    }

    // Modal Logic
    editListBtn.addEventListener('click', () => {
        // Provide them in numbered format for easy reading/pasting
        classTextarea.value = students.map((s, i) => `${i + 1}. ${s}`).join('\n');
        editModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        editModal.classList.remove('active');
    });

    saveListBtn.addEventListener('click', () => {
        const rawLines = classTextarea.value.split('\n');
        students = rawLines
            .map(line => {
                // Remove numbering if they pasted it (e.g. "1. AAKASH" -> "AAKASH")
                return line.replace(/^\d+[\.\)]\s*/, '').trim();
            })
            .filter(name => name.length > 0)
            .map(toProperCase);

        localStorage.setItem('fullClassList', JSON.stringify(students));
        absentStudents.clear();
        ondutyStudents.clear();

        renderList();
        updateStats();
        editModal.classList.remove('active');
    });

    // Format Date for report
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dateStr;
    }

    // Generate Report
    function generateReportText() {
        const formattedDate = formatDate(dateInput.value);
        const total = students.length;
        const absentCount = absentStudents.size;
        const ondutyCount = ondutyStudents.size;
        const presentCount = total - absentCount - ondutyCount;

        let report = `Date: ${formattedDate}\n`;
        report += `Advisor Name: Mrs.M.Geethanjali\n`;
        report += `Section/Branch: CSE A\n`;
        report += `Present: ${presentCount}\n`;
        report += `Absent: ${absentCount}\n`;
        if (ondutyCount > 0) {
            report += `On-Duty: ${ondutyCount}\n`;
        }

        if (absentCount > 0) {
            let absentBoysList = [];
            let absentGirlsList = [];

            // Group them by keeping original order
            students.forEach((student) => {
                if (absentStudents.has(student)) {
                    const gender = genderMap[student.toUpperCase()] || "M";
                    if (gender === "M") absentBoysList.push(student);
                    else absentGirlsList.push(student);
                }
            });

            if (absentBoysList.length > 0) {
                report += `Absent Boys\n`;
                absentBoysList.forEach((boy, index) => {
                    report += `${index + 1}. ${boy}\n`;
                });
                report += `\n`;
            } else {
                report += `Absent Boys: None\n\n`;
            }

            if (absentGirlsList.length > 0) {
                report += `Absent Girls\n`;
                absentGirlsList.forEach((girl, index) => {
                    report += `${index + 1}. ${girl}\n`;
                });
            } else {
                report += `Absent Girls: None\n`;
            }
        } else {
            report += `Absent Boys: None\nAbsent Girls: None\n`;
        }

        if (ondutyCount > 0) {
            report += `\nOn-Duty Students:\n`;
            let counter = 1;
            students.forEach((student) => {
                if (ondutyStudents.has(student)) {
                    report += `${counter}. ${student}\n`;
                    counter++;
                }
            });
        }

        return report.trim();
    }

    generateBtn.addEventListener('click', () => {
        const finalReport = generateReportText();
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(finalReport).then(() => {
                showToast();
            }).catch(err => {
                console.error('Could not copy text: ', err);
                fallbackCopyTextToClipboard(finalReport);
            });
        } else {
            fallbackCopyTextToClipboard(finalReport);
        }
    });

    shareBtn.addEventListener('click', () => {
        const finalReport = generateReportText();
        const textToShare = encodeURIComponent(finalReport);
        window.open(`https://wa.me/?text=${textToShare}`, '_blank');
    });

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert("Failed to copy automatically! Here is the text:\n\n" + text);
        }
        document.body.removeChild(textArea);
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Run
    init();
});
