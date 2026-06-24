type DaumPostcodeData = {
    zonecode: string;
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    address: string;
};

type DaumPostcodeConstructor = new (options: {
    oncomplete: (data: DaumPostcodeData) => void;
}) => {
    open: () => void;
};

declare global {
    interface Window {
        daum?: {
            Postcode: DaumPostcodeConstructor;
        };
    }
}

const POSTCODE_SCRIPT_ID = "daum-postcode-script";
const POSTCODE_SCRIPT_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

function loadDaumPostcodeScript() {
    if (window.daum?.Postcode) {
        return Promise.resolve();
    }

    const existingScript = document.getElementById(POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
        return new Promise<void>((resolve, reject) => {
            existingScript.addEventListener("load", () => resolve(), {once: true});
            existingScript.addEventListener("error", () => reject(new Error("주소찾기 스크립트를 불러오지 못했습니다.")), {once: true});
        });
    }

    return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.id = POSTCODE_SCRIPT_ID;
        script.src = POSTCODE_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("주소찾기 스크립트를 불러오지 못했습니다."));
        document.body.appendChild(script);
    });
}

export async function openDaumPostcode() {
    await loadDaumPostcodeScript();

    return new Promise<DaumPostcodeData>((resolve, reject) => {
        if (!window.daum?.Postcode) {
            reject(new Error("주소찾기 서비스를 사용할 수 없습니다."));
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => resolve(data),
        }).open();
    });
}
