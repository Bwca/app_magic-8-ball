export interface CreateAnswerTexturesPayload {
    answer: {
        text: string;
        lineSeparator: string;
    };
    fontParams: {
        fillStyle: string;
        font: string;
        size: number;
        sizeRatio: number;
    };
}
