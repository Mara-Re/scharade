const assertUnreachable = (x: never): never => {
    console.log("assertUnreachable", x);
    throw new Error("unreachable");
}

export default assertUnreachable;