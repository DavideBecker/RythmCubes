function rand(a, b) {
    var min = 0
    var max = 0

    if (b) {
        min = a || 0
        max = b || 0
    } else {
        min = 0
        max = a
    }

    return Math.round(Math.random() * max + min)
}