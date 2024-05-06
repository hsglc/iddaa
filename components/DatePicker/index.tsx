import { useRef, useState } from "react";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import type { Props } from "./types";

import {
  SelectContainer,
  OptionsList,
  Placeholder,
  OptionLabel,
  OptionInput,
  Checkmark,
  Date,
  IconWrapper,
} from "./styled";

export const DatePicker = ({
  options,
  onChange,
  value,
  placeholder,
  isSearching
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef(null);

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOutsideClick(selectRef, handleClickOutside);

  const onDateSelect = (date: string) => {
    return value.includes(date);
  };

  const isAnyChecked = value.length > 0;

  return (
    <SelectContainer ref={selectRef}>
      <Placeholder isChecked={isSearching} onClick={() => setIsOpen(!isOpen)}>
        {placeholder}
      </Placeholder>
      <IconWrapper isOpen={!isOpen} isChecked={isSearching}>
        <Image
          src={isSearching ? "/svg/activeFilter.svg" : "/svg/upperArrow.svg"}
          alt="open date dropdown"
          width={8}
          height={8}
          priority
        />
      </IconWrapper>
      {isOpen && (
        <OptionsList>
          {options.map((date, index) => (
            <OptionLabel
              key={index}
              onClick={() => {
                onChange(date);
              }}>
              <OptionInput type="checkbox" name="date" value={date} />
              <Checkmark isChecked={onDateSelect(date)} />
              <Date isChecked={onDateSelect(date)}>{date}</Date>
            </OptionLabel>
          ))}
        </OptionsList>
      )}
    </SelectContainer>
  );
};