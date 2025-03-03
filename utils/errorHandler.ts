export function handleError(error: unknown, customMessage: string): { message: string } {
        // Log the full error if it's an instance of Error
        console.error(customMessage, error);
        return { message: customMessage};
}