import { IContext } from "~/connectionResolvers";
import { VAT_ROW_STATUS } from "@/accounting/@types/vatRow";

const generateFilterCat = async ({
  kinds,
  searchValue,
  status,
}) => {
  const filter: any = {};
  filter.status = { $nin: [VAT_ROW_STATUS.DELETED] };

  if (status && status !== 'active') {
    filter.status = status;
  }

  if (kinds?.length) {
    filter.kind = { $in: kinds };
  }

  if (searchValue) {
    filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    filter.number = new RegExp(`.*${searchValue}.*`, 'i');
  }

  return filter;
};

const vatRowQueries = {
  async vatRows(
    _root,
    { kinds, searchValue, status },
    { models }: IContext,
  ) {
    const filter = await generateFilterCat({
      kinds,
      status,
      searchValue
    });

    const sortParams: any = { number: 1 };

    return await models.VatRows.find(filter).sort(sortParams)
      .collation({ locale: "en", numericOrdering: true }).lean();
  },

  async vatRowsCount(
    _root,
    { kinds, searchValue, status },
    { models }: IContext,
  ) {
    const filter = await generateFilterCat({
      searchValue,
      status,
      kinds,
    });
    return models.VatRows.find(filter).countDocuments();
  },

  async vatRowDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.VatRows.findOne({ _id }).lean();
  },
};

// checkPermission(vatRowQueries, 'vatRows', 'showVatRows', []);

export default vatRowQueries;
