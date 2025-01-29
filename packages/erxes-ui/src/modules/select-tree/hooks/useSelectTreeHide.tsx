import { useRecoilState } from 'recoil';

import { hideChildrenAtomFamily } from 'erxes-ui/modules/select-tree/states/selectTreeStates';

import { useSelectTreeContext } from '../context/SelectTreeContext';

export const useSelectTreeHide = () => {
  const { id } = useSelectTreeContext();
  const [hideChildren, setHideChildren] = useRecoilState(
    hideChildrenAtomFamily(id)
  );

  const toggleHideChildren = (order: string) => {
    if (hideChildren.includes(order)) {
      setHideChildren(hideChildren.filter((child) => child !== order));
    } else {
      setHideChildren([...hideChildren, order]);
    }
  };

  const checkIsHidden = (order: string) => {
    const hiddenParent = hideChildren.find(
      (e) => order.includes(e) && order.length > e.length
    );
    return !!hiddenParent;
  };

  return { hideChildren, toggleHideChildren, checkIsHidden };
};
