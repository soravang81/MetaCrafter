export const userTypeToEnum = (userType: string): number => {
    switch(userType) {
        case "Founder":
            return 0;
        case "Investor":
            return 1;
        case "CoFounder":
            return 2;
        case "PreSaleBuyer":
            return 3;
        case "RegularBuyer":
            return 4;
        case "Consumer":
            return 5;
        case "Retailer":
            return 6;
        default:
            throw new Error("Invalid user type");
    }
}