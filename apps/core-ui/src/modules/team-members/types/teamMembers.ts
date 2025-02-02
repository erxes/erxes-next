export interface AssignMemberFetchMoreProps {
    fetchMore: () => void;
    usersLength: number;
    totalCount: number;
}

export interface IAssignMember {
    _id: string;
    details: {
        fullName: string;
        avatar: string;
    };
}