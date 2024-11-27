"use client";

import React, { FormEvent, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { addUserEmailToProduct } from "@/lib/actions";

interface Props {
  productId: string;
}

const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    await addUserEmailToProduct(productId, email);
    setIsSubmitted(false);
    setEmail("");
    closeModal();
  };

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  return (
    <div className="">
      <button
        type="button"
        className="py-4 px-4 bg-color1 hover:bg-opacity-70 rounded-[30px] min-w-[200px] w-full text-white text-lg font-semibold"
        onClick={openModal}
      >
        Track
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeModal}
          className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-60"
        >
          <div className="min-h-screen px-4 text-center">
            <Transition
              show={isOpen}
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0"></div>
            </Transition>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            />

            <Transition
              show={isOpen}
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="p-6 bg-white inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border-2 border-grey-200 rounded-10">
                      <Image
                        src="/favicon.svg"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    </div>
                    <Image
                      src="/svgs/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>
                  <h4 className="text-color1 text-lg leading-[24px] font-semibold mt-4">
                    Get the latest product price alerts delivered straight to
                    your inbox!
                  </h4>
                  <p className="mt-2 text-sm text-color2">
                    Stay on top of every deal with our timely price alerts!
                  </p>
                </div>
                <form
                  action=""
                  className="flex flex-col mt-5"
                  onSubmit={handleSubmit}
                >
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="px-5 py-3 mt-3 flex items-center gap-2 border border-gray-300 rounded-[27px]">
                    <Image
                      src="/svgs/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />
                    <input
                      required
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 pl-1 border-none text-gray-500 text-base focus:outline-none border border-gray-300 rounded-[27px] shadow-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-black text-white text-base font-semibold border border-color2 rounded-lg mt-8"
                  >
                    {isSubmitted ? "Submitting..." : "Track"}
                  </button>
                </form>
              </div>
            </Transition>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Modal;
