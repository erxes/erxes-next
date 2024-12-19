import { Fragment } from 'react';
import { Header, Breadcrumb } from 'erxes-ui/components';

const breadcrumbs = [
    { title: 'Settings', path: 'settings' },
    { title: 'Profile', path: 'profile' },
]

const ProfileHeader = () => {
    return (
        <Header>
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    {breadcrumbs.map((breadcrumb, index) => {
                        const currentPath = breadcrumbs.slice(0, index + 1).map(b => b.path).join('/');

                        return (
                            <Fragment key={`breadcrumb-${index}`}>
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href={`/${currentPath}`}>{breadcrumb.title}</Breadcrumb.Link >
                                </Breadcrumb.Item>
                                {(breadcrumbs.length - 1) !== index && <Breadcrumb.Separator key={`separator-${index}`} />}
                            </Fragment>
                        )
                    })}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </Header>
    )
}

export default ProfileHeader