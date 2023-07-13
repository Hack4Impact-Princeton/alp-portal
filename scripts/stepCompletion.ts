// How will you fundraise?
export function checkStepZero(fundraise: string) {
    return (fundraise != "");
}

// Read and accept terms
export function checkStepOne(terms: boolean) {
    return (terms);
}

// Collecting books
export function checkStepTwo(books: number, booksGoal: number) {
    return (books >= booksGoal);
}

// International fee
export function checkStepThree(intfee: number) {
    return (intfee >= 250);
}

// Domestic fee
export function checkStepFour(domfee: number) {
    return (domfee >= 400);
}

// Gather shipping materials
export function checkStepFive(materials: boolean[]) {
    return (materials[0] == materials[1] == materials[2] == materials[3] == true);
}

// Final shipment info
export function checkStepSix() {
    
}