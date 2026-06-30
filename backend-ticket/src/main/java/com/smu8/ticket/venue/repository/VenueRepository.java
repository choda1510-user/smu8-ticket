package com.smu8.ticket.venue.repository;

import com.smu8.ticket.venue.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    Page<Venue> findAll(Pageable pageable);

    @Query("""
            select venue
            from Venue venue
            where (:venueName is null
                    or lower(venue.name) like lower(concat('%', :venueName, '%')))
              and (:venueId is null or venue.id = :venueId)
            """)
    Page<Venue> search(
            @Param("venueName") String venueName,
            @Param("venueId") Long venueId,
            Pageable pageable
    );
}
