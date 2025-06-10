import {
  CompaniesMergeSheet,
  CompaniesMergeSheetTrigger,
} from '@/contacts/companies/components/companies-command-bar/merge/CompaniesMergeSheet';
import { Row } from '@tanstack/table-core';
import { TCompany } from '@/contacts/types/companyType';
import _ from 'lodash';

interface CompaniesMergeProps {
  companies: TCompany[];
  rows: Row<TCompany>[];
}

export const CompaniesMerge = ({ companies, rows }: CompaniesMergeProps) => {
  const disabled = companies.length !== 2;
  if (disabled) return <CompaniesMergeSheetTrigger disabled={disabled} />;
  return CompaniesMergeLogic({ companies, rows });
};

const CompaniesMergeLogic = ({ companies, rows }: CompaniesMergeProps) => {
  const customizer = (objValue: any, srcValue: any, key: string) => {
    if (objValue === null) return srcValue;
    else if (srcValue === null) return objValue;
    else if (_.isArray(objValue) && _.isArray(srcValue))
      return objValue.concat(srcValue);
    else if (_.isObject(objValue) && _.isObject(srcValue))
      return _.mergeWith(objValue, srcValue, customizer);
    else if (objValue !== srcValue) {
      const type = key === 'avatar' ? 'avatar' : 'string';
      return { conflicted: true, objValue, srcValue, type };
    }
    return undefined;
  };

  const mergedCompany = _.mergeWith(
    _.cloneDeep(companies[0]),
    companies[1],
    customizer,
  );

  return (
    <CompaniesMergeSheet className="p-6 flex gap-2 h-full">
      <div className="flex-[2] h-full flex flex-col gap-2">
        <div className="flex justify-between gap-2 mb-1 ">
          <span className="text-sm font-semibold text-muted-foreground w-full">
            {companies[0]?.primaryName}
          </span>
          <span className="text-sm font-semibold text-muted-foreground w-full">
            {companies[1]?.primaryName}
          </span>
        </div>
      </div>
      <div className="flex-[1.2] h-full ml-5 flex flex-col gap-2">
        
      </div>
    </CompaniesMergeSheet>
  );
};
