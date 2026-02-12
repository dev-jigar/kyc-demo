"use client";

import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/Button";
import { CreateProductFormValues } from "./types";

type Props = {
  onSubmit: (data: CreateProductFormValues) => Promise<void>;
  defaultValues?: CreateProductFormValues;
};

export function CreateProductForm({ onSubmit, defaultValues }: Props) {
  const methods = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultValues ?? {
      userId: "",
      application: { id: "" },
      subject: {
        subjectType: ESubjectTypeSdkV1.USER,
        references: [
          new ReferenceSdkV1DataModel(EReferenceTypeSdkV1.PHONE, ""),
        ],
      },
      data: {
        eventTypeId: "",
        appName: "",
        deviceDate: new Date().toISOString(),
        latitude: 0,
        longitude: 0,
        meanSeaLevel: 0,
        ipAddress: "",
        status: "MINTED",
        eventDate: new Date().toISOString(),
      },
      skipOrgVdtCheck: false,
    },
  });

  const { handleSubmit, control, register } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-lg"
      >
        <label className="flex flex-col">
          User ID
          <input
            {...register("userId")}
            placeholder="Enter User ID (UUID)"
            className="input-field"
          />
        </label>

        <label className="flex flex-col">
          Application ID
          <input
            {...register("application.id")}
            placeholder="Enter App Name / ID"
            className="input-field"
          />
        </label>

        <label className="flex flex-col">
          Subject Type
          <Controller
            control={control}
            name="subject.subjectType"
            render={({ field }) => (
              <select {...field} className="input-field">
                {Object.values(ESubjectTypeSdkV1).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          />
        </label>

        <label className="flex flex-col">
          Subject Reference Value
          <input
            {...register("subject.references.0.value")}
            placeholder="Reference Value"
            className="input-field"
          />
        </label>

        <label className="flex flex-col">
          Event Type ID
          <input
            {...register("data.eventTypeId")}
            placeholder="Event Type ID"
            className="input-field"
          />
        </label>

        <label className="flex flex-col">
          App Name
          <input
            {...register("data.appName")}
            placeholder="App Name"
            className="input-field"
          />
        </label>

        <label className="flex flex-col">
          IP Address
          <input
            {...register("data.ipAddress")}
            placeholder="IP Address"
            className="input-field"
          />
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("skipOrgVdtCheck")} />
          Skip Org VDT Check
        </label>

        <Button type="submit" variant="primary">
          Create Product
        </Button>
      </form>
    </FormProvider>
  );
}
