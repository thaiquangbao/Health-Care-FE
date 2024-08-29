const BookingServiceRecord = {
    doctor: {
        fullName: string,
        phone: string,
        image: string,
        _id: ObjectID,
        specialize: string
    },
    patient: {
        fullName: string,
        phone: string,
        image: string,
        _id: ObjectID,
        dateOfBirth: date,
        sex: boolean
    },
    priceList: {
        type: string, // 3 thang, 6 thang, 12 thang
        price: number
    },
    status: {
        status_type: string, // gom QUEUE, REJECTED, ACCEPTED, SUCCESS, deflaut = QUEUE
        message: string
    },
    date: { // ngay dat dich vu
        day, month, year, time
    },
    diseaseMonitorings: [{ // deflaut = []
        symptom: string, // trieu chung moi ngay
        vitalSign: { // cac chi so ho hap
            temperature: number,
            bloodPressure: number,
            heartRate: number,
        },
        date: { // ngay cap nhat
            day, month, year, time
        },
        note: string
    }],
    reExaminationDates: [{ // ngay tai kham, deflaut = []
        day, month, year, time
    }]
}
