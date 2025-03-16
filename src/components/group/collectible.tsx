import React from "react";
import { collectibles } from "./collectibles";

interface CollectibleComponentsProps {
  collectibleList: string[];
}

const CollectibleComponents: React.FC<CollectibleComponentsProps> = ({
  collectibleList,
}) => {

  return (
    <div className="grid grid-cols-3 gap-4 p-4 max-h-72 overflow-y-auto">
      {collectibles.length > 0 ? (
        collectibles.map((collectible, index) => {
          return (
            <div
              key={index}
              className={`relative flex flex-col items-center ${collectibleList.includes(collectible.id) ? 'opacity-100' : 'opacity-30'}`}
            >
              <img
                src={collectible.imageUrl}
                className="w-16 h-16 object-cover rounded-md mb-2"
              />
            </div>
          );
        })
      ) : (
        <p className="text-white text-center">No collectibles available</p>
      )}
    </div>
  );
};

export default CollectibleComponents;
