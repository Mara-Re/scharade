export const getGameUid = () => {
    const url = window.location.href;
    const gameUid = url.split("/game/")[1] && url.split("/game/")[1].replace(/\//g, "");
    return gameUid;
}