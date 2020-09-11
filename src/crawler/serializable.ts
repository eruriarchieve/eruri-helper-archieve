interface Serializable {
    serialize(): {
        [key: string]: unknown
    };
}

export default Serializable;
