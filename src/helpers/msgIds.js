export function msgIds(id1,id2) {
    const id = id1 > id2 ? `${id1 + id2}` : `${id2 + id1}`
    return id
}

