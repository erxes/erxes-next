export interface ICycle {
    _id: string;
    description: string;
    donePercent: number;
    endDate: string;
    isActive: boolean;
    isCompleted: boolean;
    name: string;
    startDate: string;
    statistics: any;
    teamId: string;
    unFinishedTasks: number;
}