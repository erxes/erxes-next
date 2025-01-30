import { useRecoilCallback, useRecoilValue } from 'recoil';
import { hideChildrenAtomFamily } from 'erxes-ui/modules/select-tree/states/selectTreeStates';
import { useSelectTreeContext } from 'erxes-ui/modules/select-tree/context/SelectTreeContext';

export function useSelectTreeHide(order: string) {
  const { id } = useSelectTreeContext();
  const hideChildren = useRecoilValue(hideChildrenAtomFamily(id));

  const toggleHideChildren = useRecoilCallback(
    ({ set, snapshot }) =>
      async (order: string) => {
        const currentHideChildren = await snapshot.getPromise(
          hideChildrenAtomFamily(id)
        );
        
        set(
          hideChildrenAtomFamily(id),
          currentHideChildren.includes(order)
            ? currentHideChildren.filter(child => child !== order)
            : [...currentHideChildren, order]
        );
      },
    [id]
  );

  const isHiddenByParent = hideChildren.some(e => order.startsWith(e) && order.length > e.length);

  const isHidden = hideChildren.includes(order);

  return {
    hideChildren,
    toggleHideChildren,
    isHidden,
    isHiddenByParent
  } as const;
}
