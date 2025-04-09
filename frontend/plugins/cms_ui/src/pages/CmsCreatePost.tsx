import { Button, Input, Select, Switch, Textarea } from 'erxes-ui';

export const CmsCreatePost = () => {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-6">
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border"></div>
      <div className="w-full md:w-[300px] bg-white p-4 rounded-2xl shadow-sm border">
        <div className="flex justify-center mb-4 text-sm text-muted-foreground space-x-4">
          <span className="font-semibold text-primary">Desktop</span>
          <span>Tablet</span>
          <span>Mobile</span>
        </div>

        <div className="w-full aspect-[9/16] bg-[#4B3B8F] rounded-xl p-3 flex justify-center items-center">
          <div className="bg-white p-4 rounded-xl w-full text-center space-y-3">
            <div className="text-xs font-semibold text-primary">
              Tourism Week form
            </div>
            <div className="font-bold text-lg">MONGOLIA</div>
            <p className="text-sm text-muted-foreground">
              Аялал жуулчлалын салбарыг хөгжүүлэхэд хувь нэмэр оруулах цахим
              систем...
            </p>
            <Button className="w-full">Үргэлжлүүлэх</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
