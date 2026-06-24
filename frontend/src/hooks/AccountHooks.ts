/*
* crud api를 호출하는 함수를 정의
* id를 바탕으로 사용자 정보를 불러오는 커스텀 훅 작성
* 백엔드 url은 항상 .env 파일에서 가져오기
* 백엔드 구현 전까지는 목업 데이터로 대체
*/
export function useAccount(id: string | null | undefined): object | null {
    return {
        id: id,
        nickname: "nickname"
    };
}
export function login() {
}
export function logout() {
}
export function signUp() {
}
export function update() {
}
export function withdraw() {
}
