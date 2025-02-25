import { hideChildrenAtomFamily } from 'erxes-ui/modules/select-tree/states/selectTreeStates';
import { useSelectTreeContext } from 'erxes-ui/modules/select-tree/context/SelectTreeContext';
import { useAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

export function useSelectTreeHide(order: string) {
  const { id } = useSelectTreeContext();
  const [hideChildren] = useAtom(hideChildrenAtomFamily(id));

  const toggleHideChildren = useAtomCallback(
    (get, set) =>
      (order: string) => {
        const currentHideChildren = get(hideChildrenAtomFamily(id));

        set(
          hideChildrenAtomFamily(id),
          currentHideChildren.includes(order)
            ? currentHideChildren.filter((child: string) => child !== order)
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
    isHiddenByParent,
  } as const;
}
