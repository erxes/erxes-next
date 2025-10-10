import { composePlugins, withNx, withReact } from '@nx/rspack';

export default composePlugins(withNx(), withReact());
