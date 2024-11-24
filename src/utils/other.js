export function formatMoney(num) {
    if (num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

export function formatTimeAndFind(appointments, time) {
    if (appointments && appointments.length > 0) {
        const times = appointments.map(item => { return { hour: Number(new Date(item.appointment_date).getHours()), minute: Number(new Date(item.appointment_date).getMinutes()) } })
        const timeFound = times.filter(item => item.hour === Number(time.split(":")[0]) && item.minute === Number(time.split(":")[1]))[0]
        return timeFound
    }
    return null
}

export const returnNumber = (num) => {
    if (num < 10) {
        return `0${num}`
    }
    return num
}

export const sicks = [
    {
        image: 'https://jiohealth.com/assets/icons/cardiology/abdominal.svg',
        title: 'Phình động mạch chủ bụng'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/angina.svg',
        title: 'Đau thắt ngực'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/aortic-valve-disease.svg',
        title: 'Bệnh van động mạch chủ'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/aortic-valve-regurgitation.svg',
        title: 'Hở van động mạch chủ'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/aortic-valve-stenosis.svg',
        title: 'Hẹp van động mạch chủ'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/arteriosclerosis.svg',
        title: 'Xơ cứng động mạch'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/atrial-fibrillation.svg',
        title: 'Rung nhĩ'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/atrial-flutter.svg',
        title: 'Cuồng nhĩ'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/atrial-tachycardia.svg',
        title: 'Nhịp nhanh nhĩ'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/bradycardia.svg',
        title: 'Nhịp tim chậm'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/cardiomyopathy.svg',
        title: 'Bệnh cơ tim'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/carotid-artery-disease.svg',
        title: 'Bệnh lý động mạch cảnh'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/congenital-heart-defects.svg',
        title: 'Dị tật tim bẩm sinh'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/coronary-artery-disease.svg',
        title: 'Bệnh mạch vành'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/dilated-cardiomyopathy.svg',
        title: 'Bệnh cơ tim giãn nở'
    }, {
        image: 'https://jiohea  lth.com/assets/icons/cardiology/erectile-dysfunction.svg',
        title: 'Rối loạn cương dương'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/hypercholesterolemia.svg',
        title: 'Tăng cholesterol máu'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/heart-arrhythmia.svg',
        title: 'Rối loạn nhịp tim'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/heart-disease.svg',
        title: 'Bệnh tim'
    }, {
        image: 'https://jiohealth.com/assets/icons/cardiology/heart-failure.svg',
        title: 'Suy tim'
    }, {
        image:
            "https://jiohealth.com/assets/icons/cardiology/vasculitis.svg",
        title: "Viêm mạch",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/varicose-veins.svg",
        title: "Suy tĩnh mạch",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/tricuspid-valve-disease.svg",
        title: "Bệnh van ba lá",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/transient-ischemic-attack.svg",
        title: "Cơn thoán thiếu máu não",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/tachycardia.svg",
        title: "Nhịp tim nhanh",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/pulmonary-stenosis.svg",
        title: "Hẹp van động mạch phổi",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/pulmonary-valve-disease.svg",
        title: "Bệnh van động mạch phổi",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/pulmonary-hypertension.svg",
        title: "Tăng áp phổi",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/peripheral-artery-disease.svg",
        title: "Bệnh động mạch ngoại biên",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/pulmonary-edema.svg",
        title: "Phù phổi",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/pericardial-effusion.svg",
        title: "Tràn dịch màn ngoài tim",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/myocarditis.svg",
        title: "Viêm cơ tim",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/myocardial-ischemia.svg",
        title: "Thiếu máu cơ tim",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/mitral-valve-stenosis.svg",
        title: "Hẹp van hai lá",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/mitral-valve-regurgitation.svg",
        title: "Hở van hai lá",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/mitral-valve-disease.svg",
        title: "Bệnh van hai lá",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/metabolic-syndrome.svg",
        title: "Hội chứng chuyển hóa",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/hypertrophic-cardiomyopathy.svg",
        title: "Bệnh cơ tim phì đại",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/heart-valve-disease.svg",
        title: "Bệnh van tim",
    },
    {
        image:
            "https://jiohealth.com/assets/icons/cardiology/heart-palpitations.svg",
        title: "Dánh trống ngực",
    },
]

export function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function shuffleArray(array) {
    // Duyệt qua các phần tử từ cuối đến đầu
    for (let i = array.length - 1; i > 0; i--) {
        // Chọn một chỉ số ngẫu nhiên từ 0 đến i
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Hoán đổi phần tử tại i và randomIndex
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}