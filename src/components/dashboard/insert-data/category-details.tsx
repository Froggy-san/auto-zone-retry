import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryProps, ProductType } from "@lib/types";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { EllipsisVertical, Trash2, X } from "lucide-react";
import ProductTypeForm from "./prodcut-type-form";
import Spinner from "@components/Spinner";
import { deleteProductTypeAction } from "@lib/actions/productTypeActions";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import { PiSubtract } from "react-icons/pi";

interface Props {
  open: boolean;
  setOpen: () => void;
  category: CategoryProps | undefined;
}

const animation = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: 2, opacity: 0.3 },
};

const opacity = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
const CategoryDetails = ({ open, setOpen, category }: Props) => {
  const [subCatToEdit, setSubCatToEdit] = useState<number | undefined>();
  const [subCatToDelete, setSubCatToDelete] = useState<number | null>();
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const subCategoryToEdit = category?.productTypes.find(
    (pro) => pro.id === subCatToEdit
  );
  const subCategoryDelete = category?.productTypes.find(
    (proType) => proType.id === subCatToDelete
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="  sm:p-14 max-h-[65vh] p-3  sm:max-h-[76vh] overflow-y-auto  rounded-none sm:rounded-none  lg:rounded-lg space-y-4  max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>
            All sub-category of <span>&#40;</span>
            <AnimatePresence>
              {category?.name && (
                <motion.span
                  variants={opacity}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.1 }}
                >
                  {category.name}
                </motion.span>
              )}
            </AnimatePresence>
            <span>&#41;</span>
          </DialogTitle>
          <DialogDescription className=" hidden">.</DialogDescription>
        </DialogHeader>

        <div className=" my-12">
          <AnimatePresence mode="wait">
            {category?.productTypes.length ? (
              <motion.ul
                key="list"
                variants={animation}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className=" flex gap-3 items-start justify-between flex-wrap"
              >
                {category.productTypes
                  .sort((a, b) => a.id - b.id)
                  .map((subCat) => (
                    <SubCategory
                      key={subCat.id}
                      subCat={subCat}
                      isDeleting={isDeleting === subCat.id}
                      setSubCatToEdit={setSubCatToEdit}
                      setDeleteOpen={() => setSubCatToDelete(subCat.id)}
                    />
                  ))}
              </motion.ul>
            ) : (
              <motion.p
                key="paragraph"
                variants={animation}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className=" flex flex-col gap-3 justify-center items-center "
              >
                {" "}
                <span className="  font-semibold md:text-xl">
                  No related sub-categories to{" "}
                  <AnimatePresence mode="wait">
                    {category?.name && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        &apos;{category.name}&apos;
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <PiSubtract className=" md:h-10 md:w-10 w-6 h-6 text-muted-foreground" />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
          <div className="space-y-0.5   ">
            <label className=" font-semibold">Add car models</label>
            <p className=" text-muted-foreground text-sm">
              Add a new car model to {category?.name}&apos;s list.
            </p>
          </div>
          <div className="  sm:pr-2">
            <Button
              size="sm"
              className=" w-full"
              onClick={() => setAddTypeOpen(true)}
            >
              Create Sub-category
            </Button>

            {category && (
              <ProductTypeForm
                productTypeToEdit={subCategoryToEdit}
                open={addTypeOpen || !!subCategoryToEdit}
                relatedCategory={category}
                setOpen={() => {
                  setAddTypeOpen(false);
                  setSubCatToEdit(undefined);
                }}
              />
            )}
            <DeleteProType
              isDeleting={!!isDeleting}
              setIsDeleting={setIsDeleting}
              productType={subCategoryDelete}
              setOpen={() => setSubCatToDelete(null)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function SubCategory({
  subCat,
  isDeleting,
  setDeleteOpen,
  setSubCatToEdit,
}: {
  subCat: ProductType;
  isDeleting: boolean;
  setDeleteOpen: () => void;
  setSubCatToEdit: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  return (
    <li
      onClick={() => setSubCatToEdit(subCat.id)}
      className={cn(
        `relative   w-fit  min-w-[120px]   sm:min-w-[150px]   md:min-w-[170px]   px-3 py-2 flex flex-col  items-center  justify-between    hover:bg-accent/30  transition-all cursor-pointer  gap-2 text-sm   rounded-xl  flex-1 `,
        { "px-3 py-[0.4rem] ": !subCat.image }
      )}
    >
      {subCat.image ? (
        <img
          src={subCat.image}
          alt={`${subCat.name} image`}
          className=" h-16  sm:h-20 block  object-contain"
        />
      ) : null}

      <div className="flex items-center  w-full  justify-center gap-2 ">
        <p
          className={cn("   w-full  pr-6 text-xs xs:text-base  text-center", {
            "   w-[99%]   text-wrap   px-[14%] ": subCat.image,
          })}
        >
          {subCat.name}
        </p>
        {isDeleting ? (
          <Spinner className="  h-4 w-4 absolute right-3  bottom-2" />
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteOpen();
            }}
            variant="destructive"
            className=" absolute right-2  bottom-[0.3rem]  p-0 h-6 w-6"
          >
            <Trash2 className=" w-4 h-4" />
          </Button>
        )}
      </div>
    </li>
  );
}

function DeleteProType({
  productType,
  setOpen,
  isDeleting,
  setIsDeleting,
}: {
  isDeleting: boolean;
  productType?: ProductType;
  setOpen: () => void;
  setIsDeleting: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const { toast } = useToast();
  return (
    <Dialog open={!!productType} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You are about to delete sub-category
            <AnimatePresence>
              {productType?.name && (
                <motion.span
                  variants={opacity}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.1 }}
                >
                  {productType.name}
                </motion.span>
              )}
            </AnimatePresence>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="   gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isDeleting}
            variant="destructive"
            size="sm"
            onClick={async () => {
              try {
                if (!productType) return;
                setIsDeleting(productType.id);
                const { error } = await deleteProductTypeAction(productType);

                if (error) throw new Error(error);

                toast({
                  className: "bg-primary  text-primary-foreground",
                  title: "Done.",
                  description: (
                    <SuccessToastDescription message="A new category has been created." />
                  ),
                });
              } catch (error: any) {
                toast({
                  variant: "destructive",
                  title: "Something went wrong.",
                  description: <ErorrToastDescription error={error.message} />,
                });
              } finally {
                setIsDeleting(null);
              }
            }}
          >
            {isDeleting ? <Spinner className=" h-full" /> : "Confrim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryDetails;
